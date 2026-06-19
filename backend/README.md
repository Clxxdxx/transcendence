<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Health checks and backups (project additions)

This project includes a minimal health-check endpoint and a backup command to support monitoring and recovery for evaluation purposes.

- Health endpoint: `GET /api/health` — returns JSON with checks for database, cache and storage. Returns `200 OK` when healthy, `503` if degraded.
- Status page: `GET /status` — human-friendly page showing the health checks.
- Backup command: `php artisan backup:run` — creates an archive of `storage/app/public` and `database/database.sqlite` (if present) under `storage/app/private/backups`. Supports `--retention` (days) to remove old backups. Scheduled daily at 02:00 by the console kernel.

Usage example:
```
cd backend
php artisan backup:run --retention=7
```

Notes:
- The backup command uses `tar` available on the host container. For MySQL/Postgres dumps you can adapt the command to use `mysqldump` or `pg_dump` and provide DB credentials via environment variables.
- Ensure `storage/app/private` is writeable by the container process.

MySQL support
- If your application uses MySQL (`DB_CONNECTION=mysql`), the `backup:run` command will try to create a `mysqldump` automatically and include it in the archive. The `backup:restore` command detects a `db.sql` file in the archive and will attempt to import it using the `mysql` client.

Requirements and caveats:
- The `mysqldump` and `mysql` client binaries must be available in the container PATH where you run the commands. If they are missing, the backup will proceed but the DB dump will be skipped.
- If your MySQL server is running in a different container, ensure the backup runner container has network access and credentials to connect (environment variables in `.env`).
- Storing DB credentials in `.env` is standard for development; for production consider using a secrets manager.

Security note:
- Avoid exposing DB credentials in logs. The command uses shell escaping but consider mounting a `.my.cnf` with restricted permissions for production containers.

Automatic schedule
- Backups are scheduled to run automatically every 6 hours via the console scheduler (cron expression: `0 */6 * * *`). Laravel requires that `php artisan schedule:run` is executed periodically (normally every minute) so it can evaluate and trigger scheduled tasks at the proper times.

Scheduler options:

- Start the scheduler as a container service (recommended for this project):

```bash
docker compose up -d --build scheduler
```

- Run the scheduler on the host (alternative): add a host `cron` entry that runs every minute:

```cron
* * * * * cd /var/www && php artisan schedule:run >> /dev/null 2>&1
```

Notes:

- The scheduler process itself runs every minute; Laravel decides which scheduled jobs should run (your backup job uses `0 */6 * * *` so it will run at 00:00, 06:00, 12:00, 18:00).
- If you prefer manual control, you can run `php artisan backup:run` on demand instead of enabling the scheduler service.

Restore
- To restore a backup archive located in `storage/app/private/backups` run:

```
php artisan backup:restore backup_20260101_120000.tar.gz
```

The command will extract the archive, restore `storage/app/public` contents and `database/database.sqlite` if present (the current sqlite DB will be moved to a `.old_TIMESTAMP` backup unless `--force` is passed).
