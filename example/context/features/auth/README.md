# Auth
status: shipped
phase: 1
covers: src/features/auth/**, src/lib/auth*.ts, src/lib/email.ts, src/app/api/auth/**, src/app/(auth)/**, src/proxy.ts, src/db/auth-schema.ts, e2e/auth.spec.ts
depends-on: foundation

## What it does
People sign in with a link sent to their email; there are no passwords. Signed-out visitors to the app are sent to the sign-in page, and signing out ends the session on that device.

## Acceptance
- [x] Entering an email sends a sign-in link that works once and expires after 10 minutes.
- [x] Signed-out visitors to `/app` are sent to `/sign-in`.
- [x] Signing out ends the session on this device.
