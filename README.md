# FlexiERP Edu App

Monorepo for the FlexiERP school management system: a Next.js 14 frontend
(`frontend/`) and its Laravel 13 backend (`backend/`), merged from two
previously separate repositories (`amoz33/FlexiERP_Edu_App` and
`amoz33/FlexiERP_Edu_App_Server`) with both repos' commit history preserved
via `git subtree`.

- [`frontend/README.md`](./frontend/README.md) — install, run, test, lint, typecheck
- [`backend/README.md`](./backend/README.md) — install, run, test, API surface, **repo hygiene notes**

## Quick start (everything, one command)

```bash
docker compose up --build
```

Frontend: http://localhost:3000 · Backend: http://localhost:8000

This brings up MySQL, the Laravel backend (migrates then serves), and the
Next.js frontend together. **Not verified by actually running Docker** —
no Docker was available in the environment this was built in. Confirm it
comes up cleanly on your machine.

## What changed in this merge

**Security**
- Patched `next` from `14.2.5` to `14.2.35` — the pinned version was
  vulnerable to three publicly disclosed, real CVEs affecting all
  Next.js 14.x App Router apps (CVE-2025-29927 middleware bypass;
  CVE-2025-55184/67779 DoS; CVE-2025-55183 source exposure). Verified
  the production build still compiles cleanly on the patched version.
- Removed two ~407KB SQL dumps from the backend containing ~1,800
  seeded demo accounts with bcrypt password hashes. Confirmed as demo
  data, but raw password-hash dumps don't belong in a repo regardless.

**Repo structure (backend)**
- The real Laravel app was nested one directory too deep
  (`flexi_edu_app/`), with a stray root-level `composer.json` and 2,605
  unrelated committed `vendor/` files from an accidental `composer
  require` run outside the actual project. Flattened and cleaned up.

**Bugs fixed (frontend)**
- `PayStackModal.tsx`'s cancel handler set state back to `idle` instead
  of `error`, so the "Payment was cancelled" message was set but never
  actually shown to the user — found because a test written to cover
  that path failed against real component behavior, not assumed.

**Missing config**
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` was missing from `.env.example`
  despite `PayStackModal.tsx` depending on it at runtime.

**Infrastructure**
- Added ESLint config for the frontend (was entirely absent despite
  `eslint` being an installed dependency) — fixed all 5 errors it found
  (unescaped JSX apostrophes).
- Added a real Jest + React Testing Library suite via `next/jest` — 17
  tests, verified passing, covering `PayStackModal` (success/cancel/
  missing-key paths) and `lib/utils.ts` (100% coverage).
- Added `npm run typecheck` (`tsc --noEmit`) — clean.
- Added GitHub Actions CI for both frontend (fully verified locally:
  `npm ci` → lint → typecheck → test → build, all green, including a
  clean install from wiped `node_modules`) and backend (Laravel/PHPUnit
  — written from standard patterns but **not executable/verifiable**
  here, no PHP available).
- Added `docker-compose.yml` + Dockerfiles for both services.

**Code cleanliness**
- Split `PortalViews.tsx` (1,229 LOC, 9 unrelated components in one
  file) into 8 files under `frontend/components/portal/views/`, each
  with only the imports it actually needs.
- Split `StudentDashboard.tsx` (556 LOC) by feature — it bundled the
  actual student dashboard together with an unrelated scheme-of-work
  feature that has its own routes and its own consumer
  (`PortalPage.tsx`). Now `StudentDashboard.tsx` (293 lines) and
  `SchemeOfWork.tsx` (378 lines), sharing one small data file.
- Both splits verified afterward with `tsc --noEmit`, `next lint`,
  a full production `build`, and the full Jest suite — all still
  passing, same route output.

## What this merge does *not* fix

- **Backend test coverage.** Only Laravel's own default scaffolding
  tests exist (`tests/Feature/ExampleTest.php`,
  `tests/Unit/ExampleTest.php`). None of the 16 API controllers have
  custom tests written for them yet.
- **Frontend test coverage isn't comprehensive.** 17 tests cover one
  component and one utility file — most of the app's pages and
  components (including the newly-split `PortalViews`/`SchemeOfWork`
  files) aren't covered.
- **Docker and backend CI are unverified by me.** Both are written from
  standard, well-established patterns, but I could not execute Docker
  or PHP in the environment this was built in. Confirm both actually
  work before relying on them.

## Repo history

```
git log --oneline --graph --all
```

shows both original repos' full commit history preserved as ancestry
under `frontend/` and `backend/` prefixes, plus the merge and cleanup
commits on top.
