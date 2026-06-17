<?php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\BackupRun;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        BackupRun::class,
        \App\Console\Commands\BackupRestore::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        // Backup every 6 hours and apply retention
        // Uses cron expression: at minute 0 every 6th hour
        $schedule->command('backup:run --retention=7')->cron('0 */6 * * *');
    }

    protected function commands()
    {
        // Load commands if any
    }
}
