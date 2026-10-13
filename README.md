# Developer Assessment Starter Project

This repository represents a small existing product codebase. Authentication, users, roles, locations, MySQL, and a basic React shell are already provided so candidates can focus on implementing one realistic feature.

The assessment is framed as a product issue: **Issue #37 — Implement Safety Inspection Recording**.

## Stack

- Backend: Node.js, NestJS, TypeScript, TypeORM, MySQL
- Frontend: React, TypeScript, Bootstrap, Vite
- Auth: JWT login with seeded users
- Workflow: Git branch + PR-style submission notes

## Quick start

Install dependencies:

```bash
npm install
```

Start MySQL:

```bash
docker compose up -d mysql
```

Start backend and frontend:

```bash
npm run dev
```

Backend: http://localhost:3000  
Frontend: http://localhost:5173

## Seeded users

| Role | Name | Email | Password |
|---|---|---|---|
| Manager | Sarah Jones | manager@example.com | password |
| Inspector | Michael Tan | inspector@example.com | password |
| Inspector | Jenny Lim | inspector2@example.com | password |

## Seeded locations

- Warehouse A
- Warehouse B
- Workshop
- Loading Dock
- Maintenance Store

## Candidate task

Start with:

1. `ASSESSMENT.md`
2. `ISSUE-37.md`
3. `ARCHITECTURE.md`
4. `API_STYLE_GUIDE.md`
5. `CONTRIBUTING.md`

Then implement Safety Inspections and complete:

- `SUBMISSION.md`
- `CODE_REVIEW.md`

## Included deliberate code review exercise

`backend/src/legacy/legacy.ts` contains intentionally mediocre code. Candidates should spend no more than 10 minutes reviewing it and add notes to `CODE_REVIEW.md`.

## Notes

- This repository uses TypeORM `synchronize: true` for assessment simplicity only. Do not use this pattern for production.
- The security model is deliberately basic. Extend it only where required by the assessment.
- Do not commit `.env`, `node_modules`, build artifacts, or local database files.

## Troubleshooting: MySQL host is not allowed

If the backend logs an error like `Host '172.x.x.x' is not allowed to connect to this MySQL server`, the Docker MySQL volume was probably created before the `assessment` user was granted access from the host network. Reset the local database volume and start again:

```bash
docker compose down -v
docker compose up -d mysql
```

Then restart the backend. This removes the local assessment database only.
