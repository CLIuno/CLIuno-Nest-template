# CLIuno Nest template

NestJS 10 + TypeORM (better-sqlite3) REST API serving the CLIuno contract: JWT auth
(verify-email gated login, refresh, reset, OTP), users, todos, posts+comments, follows,
roles — controllers self-prefix `api/v1/...`.

## Commands

```bash
pnpm start:dev   # nest start --watch (needs JWT_SECRET_KEY, REFRESH_JWT_SECRET_KEY)
pnpm build       # nest build → dist/main.js
pnpm start:prod  # node dist/main
pnpm lint        # oxlint
pnpm test        # jest
```

SQLite `database.sqlite` auto-creates (`synchronize: true`; delete for a reset).
**Keep `commitlint.config.ts` excluded in `tsconfig.build.json`** or the build output
shifts to `dist/src/` and `start:prod` breaks.

## Structure

`src/controllers/` → `src/services/` → `src/entities/`; DTOs in `src/dto/`;
`JwtAuthGuard` populates `req.user`, `AdminGuard` gates admin routes.

## Contract rules this codebase follows

- Responses: `{status, message, data}` with the exact keys frontends destructure
  (`data.users/user/todos/todo/posts/post/followers/following/isFollowing`, login `data.token`).
- Request keys: camelCase (`usernameOrEmail`, `refreshToken`, `oldPassword`/`newPassword`, `otp`).
- One-time tokens live on the user row (`reset_token`, `verify_token`); reset/verify-email
  look users up **by token**; registration stores the verify token it emails.
- The `user` role is created on first registration (fresh clone needs no seeding).
- OTP endpoints act on the authenticated user; change-password verifies the old password.
- Creates attach the authenticated user as owner (posts, todos).

## Conventions

oxc-only lint/format (`semi: false`, single quotes, 2-space); conventional commits
(commitlint + husky); pnpm build approvals live in `pnpm-workspace.yaml` `allowBuilds`.
