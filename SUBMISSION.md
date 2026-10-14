# Submission Notes

## Summary

Added the Safety Inspections feature across the backend and frontend.

Managers can create inspections, see all of them, and assign or reassign a "Yet to Start" inspection to an Inspector. Inspectors only see inspections assigned to them and can complete one by entering the location, start time, duration, pass/fail and comments.

On the backend there is a new `inspections` module (entity, DTOs, service, controller) with five endpoints:

- `GET /inspections` and `GET /inspections/:id`
- `POST /inspections` (Manager)
- `PATCH /inspections/:id/assign` (Manager)
- `PATCH /inspections/:id/complete` (assigned Inspector)

The frontend changes are in `Inspections.tsx`, plus a few new calls in `api/client.ts`.


## Assumptions

- `Yet to Start → Completed` only. There is no way to reopen a completed inspection.
- a Manager can assign or reassign only while the inspection is `Yet to Start`. Completed inspections cannot be reassigned.
- Managers cannot complete inspections on an Inspector's behalf.
- Location is recorded at completion (as the issue describes), not chosen by the Manager at creation.
- Inspections have a title so Managers can tell them apart before they're completed.

## Trade-offs / Known Limitations

- No automated tests in the repo (out of scope per the brief).
- No pagination, search or filtering.
- No editing or deleting inspections, and no unassign.

## Security Notes

- Authentication: every inspection endpoint uses `JwtAuthGuard`.
- Role checks: `RolesGuard` + `@Roles()` restrict create/assign to Managers and complete to Inspectors. the controller defaults to Manager or Inspector only.
- Identity from the token only: the current user comes from the verified JWT via `@CurrentUser()`. No endpoint accepts a user ID or role for the acting user from the request body. The `inspectorId` in the assign body is validated as an existing user with the Inspector role
## AI Usage

- Tool: Claude (Anthropic).
- What I used for: to generate documented code
- How I reviewed and changed the output: Walked through every file with Claude to understand the request flow: guards, DTO validation, the service rules, and why completion is a single conditional update.

## What I Would Improve With More Time
- Add automated tests: unit tests for `InspectionsService` rules and e2e tests for the permission matrix.
- Replace `synchronize: true` with TypeORM migrations.
- Handle JWT expiry in the frontend (redirect to login on 401).
