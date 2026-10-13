# Issue #37 — Implement Safety Inspection Recording

## Background

The product owner has requested support for recording safety inspections at factory locations.

Authentication, user management, roles, and locations already exist in the starter project. Your task is to add the inspection feature as one vertical slice across the backend and frontend.

## Acceptance Criteria

### Manager

- Can create a new inspection.
- Can view all inspections.
- Can assign a `Yet to Start` inspection to an Inspector.

### Inspector

- Can view inspections assigned to them.
- Can complete a `Yet to Start` inspection.
- Cannot view or update inspections assigned to another Inspector.

### Completion Data

When completing an inspection, the Inspector records:

- Location being inspected
- Start date and time
- Duration
- Pass or Fail
- Comments

## Notes

- Each inspection is assigned to at most one Inspector at a time.
- The unit for `Duration` is intentionally not specified. Make and document a sensible assumption.
- You may add fields if they make the workflow clearer, but avoid over-engineering.
