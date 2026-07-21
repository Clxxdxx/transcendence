<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BackupRun extends Command
{
    protected $signature = 'backup:run {--retention=7}';
    protected $description = 'Create a backup of storage and sqlite DB (if present) and apply retention policy.';

    public function handle()
    {
        $this->info('Starting backup...');
        $now = now()->format('Ymd_His');
        $backupPath = 'private/backups';
        $diskBackupPath = 'backups'; // relative to the 'local' disk root, which is already storage/app/private
        Storage::disk('local')->makeDirectory($diskBackupPath);
        $archiveName = "backup_{$now}.tar.gz";
        $tmpDir = storage_path("app/{$backupPath}/tmp_{$now}");
        @mkdir($tmpDir, 0755, true);

        // Copy public storage if exists
        $source = storage_path('app/public');
        $dest = $tmpDir . '/public';
        if (is_dir($source)) {
            $this->rrmdirCopy($source, $dest);
        }

        // Copy sqlite DB if exists
        $sqlite = database_path('database.sqlite');
        if (file_exists($sqlite)) {
            copy($sqlite, $tmpDir . '/database.sqlite');
        }

        // If using MySQL, create a dump
        $mysqlDumpFailed = false;
        try {
            $dbDefault = config('database.default');
            if ($dbDefault === 'mysql') {
                $cfg = config('database.connections.mysql');
                $this->info('Detected MySQL, creating mysqldump...');
                $dumpFile = $tmpDir . '/db.sql';
                $host = $cfg['host'] ?? '127.0.0.1';
                $port = $cfg['port'] ?? '3306';
                $user = $cfg['username'] ?? 'root';
                $pass = $cfg['password'] ?? '';
                $db = $cfg['database'] ?? '';

                $mysqldump = trim(shell_exec('which mysqldump'));
                if (!$mysqldump) {
                    $this->error('mysqldump not found in PATH. Skipping DB dump.');
                    $mysqlDumpFailed = true;
                } else {
                    $parts = [escapeshellcmd($mysqldump), '--skip-ssl'];
                    if ($host !== '') $parts[] = '-h ' . escapeshellarg($host);
                    if (!empty($port)) $parts[] = '-P ' . escapeshellarg($port);
                    if ($user !== '') $parts[] = '-u ' . escapeshellarg($user);
                    if ($pass !== '') $parts[] = '-p' . escapeshellarg($pass);
                    $parts[] = escapeshellarg($db);
                    $errFile = $tmpDir . '/mysqldump.err';
                    // Keep stderr (deprecation warnings, etc.) out of the dump file, or it corrupts the SQL on restore.
                    $cmd = implode(' ', $parts) . ' > ' . escapeshellarg($dumpFile) . ' 2>' . escapeshellarg($errFile);
                    exec($cmd, $out, $ret);
                    $errOutput = file_exists($errFile) ? file_get_contents($errFile) : '';
                    @unlink($errFile);
                    if ($ret === 0 && file_exists($dumpFile)) {
                        $this->info('DB dump created.');
                    } else {
                        $this->error('mysqldump failed or returned non-zero. Output: ' . $errOutput);
                        $mysqlDumpFailed = true;
                    }
                }
            }
        } catch (\Exception $e) {
            $this->error('Error while creating DB dump: ' . $e->getMessage());
            $mysqlDumpFailed = true;
        }

        // Create archive
        $cwd = getcwd();
        chdir($tmpDir);
        $cmd = "tar -czf ../{$archiveName} .";
        exec($cmd, $output, $ret);
        chdir($cwd);

        if (file_exists($tmpDir . "/../{$archiveName}")) {
            rename($tmpDir . "/../{$archiveName}", storage_path("app/{$backupPath}/{$archiveName}"));
            $this->info("Backup saved to {$backupPath}/{$archiveName}");
        } else {
            $this->error('Backup failed to create archive.');
        }

        // Cleanup tmp
        $this->rrmdir($tmpDir);

        // Retention
        $retention = (int) $this->option('retention');
        $files = Storage::disk('local')->files($diskBackupPath);
        foreach ($files as $file) {
            if (Str::startsWith($file, 'backups/')) {
                $basename = basename($file);
                if (Str::startsWith($basename, 'backup_')) {
                    $timestamp = Storage::disk('local')->lastModified($file);
                    if ($timestamp < now()->subDays($retention)->timestamp) {
                        Storage::disk('local')->delete($file);
                        $this->info("Deleted old backup: {$basename}");
                    }
                }
            }
        }

        if ($mysqlDumpFailed) {
            $this->error('Backup completed but the MySQL dump is missing or failed — archive does NOT contain the database.');
            return 1;
        }

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
