# API Style Guide

Follow these conventions where practical within the time box.

## Controllers

- Keep controllers thin.
- Validate input using DTOs and `class-validator`.
- Put business rules in services.
- Avoid exposing implementation details in error messages.

## Services

- Enforce workflow rules in services.
- Enforce ownership and role-sensitive access on the backend, not only in the UI.
- Prefer clear, simple code over abstraction for its own sake.

## REST

Suggested endpoint style:

```text
GET    /inspections
POST   /inspections
PATCH  /inspections/:id/assign
PATCH  /inspections/:id/complete
```

You may choose a different design if you can explain it.

## DTOs

- Use DTOs for request bodies.
- Do not accept arbitrary entity objects from the client.
- Treat client-supplied IDs as untrusted.

## Security

- Protect inspection endpoints with JWT authentication.
- Restrict Manager-only actions.
- Prevent Inspectors from accessing inspections assigned to other Inspectors.
