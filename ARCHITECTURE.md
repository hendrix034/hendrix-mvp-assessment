# Architecture Notes

This repository is a deliberately small assessment project that represents an existing application.

## Backend

- NestJS modules are grouped by domain.
- Authentication is already implemented using JWT.
- Users have a simple role: `Manager` or `Inspector`.
- TypeORM `synchronize: true` is enabled for assessment simplicity only.
- Business logic should live in services, not controllers.

Suggested module pattern:

```text
backend/src/<feature>/
  <feature>.module.ts
  <feature>.controller.ts
  <feature>.service.ts
  <feature>.entity.ts
  dto/
```

## Frontend

- React + TypeScript + Bootstrap.
- Keep the UI simple and functional.
- Use the existing API client pattern.
- Avoid spending assessment time on visual polish.

## Auth Context

The backend JWT payload includes user ID, email, and role. Endpoints that rely on the current user should use authenticated user context rather than trusting user IDs supplied by the client.
