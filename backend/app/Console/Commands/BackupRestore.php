<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BackupRestore extends Command
{
    protected $signature = 'backup:restore {file} {--force}';
    protected $description = 'Restore a backup archive from storage/app/private/backups';

    public function handle()
    {
        $file = $this->argument('file');
        $backupPath = 'private/backups';
        $full = storage_path("app/{$backupPath}/{$file}");

        if (!file_exists($full)) {
            $this->error("Backup file not found: {$full}");
            return 1;
        }

        $this->info("Restoring backup: {$file}");
        $tmpDir = storage_path("app/{$backupPath}/restore_tmp_" . uniqid());
        @mkdir($tmpDir, 0755, true);

        // Extract archive
        $cwd = getcwd();
        chdir($tmpDir);
        $cmd = "tar -xzf " . escapeshellarg($full) . " -C " . escapeshellarg($tmpDir);
        exec($cmd, $output, $ret);
        chdir($cwd);

        if ($ret !== 0) {
            $this->error('Failed to extract archive');
            $this->rrmdir($tmpDir);
            return 1;
        }

        // Restore public storage
        $srcPublic = $tmpDir . '/public';
        $destPublic = storage_path('app/public');
        if (is_dir($srcPublic)) {
            $this->info('Restoring storage/app/public...');
            $this->rrmdirCopy($srcPublic, $destPublic);
        }

        // Restore sqlite db if present
        $srcSqlite = $tmpDir . '/database.sqlite';
        $destSqlite = database_path('database.sqlite');
        if (file_exists($srcSqlite)) {
            $this->info('Restoring database/database.sqlite (backup current to .old)...');
            if (file_exists($destSqlite) && !$this->option('force')) {
                rename($destSqlite, $destSqlite . '.old_' . time());
            }
            copy($srcSqlite, $destSqlite);
        }

        // Restore MySQL dump if present
        $srcDump = $tmpDir . '/db.sql';
        if (file_exists($srcDump)) {
            try {
                $dbDefault = config('database.default');
                if ($dbDefault === 'mysql') {
                    $cfg = config('database.connections.mysql');
                    $host = $cfg['host'] ?? '127.0.0.1';
                    $port = $cfg['port'] ?? '3306';
                    $user = $cfg['username'] ?? 'root';
                    $pass = $cfg['password'] ?? '';
                    $db = $cfg['database'] ?? '';

                    $mysql = trim(shell_exec('which mysql')) ?: 'mysql';
                    $parts = [escapeshellcmd($mysql)];
                    if ($host !== '') $parts[] = '-h ' . escapeshellarg($host);
                    if (!empty($port)) $parts[] = '-P ' . escapeshellarg($port);
                    if ($user !== '') $parts[] = '-u ' . escapeshellarg($user);
                    if ($pass !== '') $parts[] = '-p' . escapeshellarg($pass);
                    $parts[] = escapeshellarg($db);
                    $cmd = implode(' ', $parts) . ' < ' . escapeshellarg($srcDump) . ' 2>&1';
                    $this->info('Importing MySQL dump (this may take a while)...');
                    exec($cmd, $out, $ret);
                    if ($ret === 0) {
                        $this->info('MySQL import completed.');
                    } else {
                        $this->error('MySQL import failed (non-zero exit). Output: ' . implode("\n", $out));
                    }
                }
            } catch (\Exception $e) {
                $this->error('Error during MySQL restore: ' . $e->getMessage());
            }
        }

        $this->info('Restore complete.');
        $this->rrmdir($tmpDir);
        return 0;
    }

    protected function rrmdirCopy($src, $dst)
    {
        $dir = opendir($src);
        @mkdir($dst, 0755, true);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->rrmdirCopy($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }

    protected function rrmdir($dir)
    {
        if (!is_dir($dir)) return;
        $files = array_diff(scandir($dir), ['.','..']);
        foreach ($files as $file) {
            (is_dir("{$dir}/{$file}")) ? $this->rrmdir("{$dir}/{$file}") : unlink("{$dir}/{$file}");
        }
        @rmdir($dir);
    }
}
