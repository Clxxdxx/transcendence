<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class HealthController extends Controller
{
    public function health()
    {
        $status = ['app' => 'ok'];

        // Database
        try {
            DB::connection()->getPdo();
            $status['database'] = 'ok';
        } catch (\Exception $e) {
            $status['database'] = 'error';
            $status['database_error'] = $e->getMessage();
        }

        // Cache
        try {
            $key = 'health_check_' . uniqid();
            Cache::put($key, now()->toDateTimeString(), 10);
            $status['cache'] = Cache::get($key) ? 'ok' : 'error';
        } catch (\Exception $e) {
            $status['cache'] = 'error';
        }

        // Storage
        try {
            $path = 'health_test.txt';
            Storage::disk('local')->put($path, now()->toDateTimeString());
            $status['storage'] = Storage::disk('local')->exists($path) ? 'ok' : 'error';
            Storage::disk('local')->delete($path);
        } catch (\Exception $e) {
            $status['storage'] = 'error';
        }

        // Last backup info
        try {
            $backupFiles = Storage::disk('local')->files('backups');
            $latest = null;
            $latestTime = null;

            // Try Storage disk first
            foreach ($backupFiles as $f) {
                $lm = Storage::disk('local')->lastModified($f);
                if ($latestTime === null || $lm > $latestTime) {
                    $latestTime = $lm;
                    $latest = $f;
                }
            }

            // Fallback: check filesystem directly (useful when mounts/permissions differ)
            if ($latest === null) {
                $dir = storage_path('app/private/backups');
                if (is_dir($dir)) {
                    $files = glob($dir . DIRECTORY_SEPARATOR . 'backup_*');
                    foreach ($files as $file) {
                        $lm = filemtime($file);
                        if ($latestTime === null || $lm > $latestTime) {
                            $latestTime = $lm;
                            $latest = $file; // full path here
                        }
                    }
                }
            }

            if ($latest) {
                // Do not expose backup filename publicly; report presence and timestamp only.
                $status['last_backup'] = 'ok';
                $status['last_backup_time'] = date('c', $latestTime);
            } else {
                $status['last_backup'] = null;
            }
        } catch (\Exception $e) {
            $status['last_backup'] = null;
        }

        $healthy = collect($status)->except('database_error')->contains('error') ? false : true;

        if (!$healthy) {
            Log::error('health.degraded', [
                'checks' => $status,
            ]);
        }

        return response()->json([
            'status' => $healthy ? 'ok' : 'degraded',
            'checks' => $status
        ], $healthy ? 200 : 503);
    }

    public function statusPage()
    {
        $response = $this->health();
        $data = $response->getData(true);
        return view('status', ['data' => $data]);
    }
}
