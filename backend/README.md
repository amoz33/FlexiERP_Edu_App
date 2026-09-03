# FlexiERP Edu App (Backend)

Laravel 13 API + Sanctum authentication backend for the FlexiERP school
management system, serving the [FlexiERP_Edu_App Next.js frontend](../frontend).

The default Laravel/Composer README this replaced didn't mention this
project at all - see [`CLAUDE.md`](./CLAUDE.md) for AI-assistant setup
notes that were already present.

## Prerequisites

- PHP 8.3+ (per `composer.json`'s `^8.3` requirement)
- Composer
- MySQL (or SQLite for local/testing - see below)
- Node.js + npm (only needed if you're building frontend assets via Vite;
  the actual frontend app is the separate Next.js project)

## Install

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

Default `.env.example` DB settings point at MySQL
(`DB_DATABASE=flexi_edu_app`, `DB_USERNAME=root`, empty password) - update
these for your local setup, or switch `DB_CONNECTION=sqlite` for a
zero-config local database.

## Run

```bash
php artisan serve
```

Serves on `http://localhost:8000` by default. API routes are under `/api`
(see `routes/api.php`).

## Test

```bash
php artisan test
```

`phpunit.xml` already configures an in-memory SQLite database for the
testing environment, so this doesn't touch your real database. Currently
only Laravel's own default scaffolding tests exist
(`tests/Feature/ExampleTest.php`, `tests/Unit/ExampleTest.php`) - no
custom tests have been written for this app's actual controllers yet.

## API surface

Public (no auth): `POST /api/auth/*` (login/register), `GET
/api/public/school`, `GET /api/public/classes`, `POST /api/admissions`.

Everything else requires Sanctum auth (`auth:sanctum` middleware) - see
`routes/api.php` for the full route list. Controllers live under
`app/Http/Controllers/Api/`, one per feature area: Academics, Admission,
Assignment, Attendance, Auth, Dashboard, Fee, Inventory, Payroll,
Results, Settings, Staff, Student, StudentPortal, TeacherAssignment,
Teacher.

## Docker

`docker compose up --build` from the repo root brings up this backend
alongside MySQL and the frontend - see the [root README](../README.md).
The `Dockerfile` in this directory was written from standard PHP/Laravel
patterns but hasn't been run in the environment this was built in (no
Docker available there) - confirm it builds cleanly on your machine.

## Repo hygiene notes (fixed during the merge into this monorepo)

- The real Laravel app used to sit one directory deeper
  (`flexi_edu_app/`), with a stray root-level `composer.json` and 2,605
  unrelated committed `vendor/` files from an accidental `composer
  require` run in the wrong directory. Both are gone - this directory
  *is* the app now.
- Two ~407KB SQL dumps (`flexi_edu_app.sql`, `flexi_edu_app_clean.sql`)
  containing ~1,800 seeded demo accounts with bcrypt password hashes
  were removed. Confirmed as demo data, not real records, but raw dumps
  with password hashes don't belong in a repo regardless. If you need
  that seed data back, rebuild it as a proper Laravel seeder in
  `database/seeders/` instead of a raw SQL dump.
