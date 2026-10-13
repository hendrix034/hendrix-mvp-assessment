# Developer Assessment: Safety Inspections Vertical Slice

## Time box

Please spend no more than approximately 2 hours on this task.

We are assessing engineering judgement, not completeness at all costs. A clean, limited solution that implements the core workflow well is preferred over an over-engineered or incomplete solution.

## Scenario

You have joined an existing development team. The starter repository already contains authentication, users, roles, locations, database connection, and a basic frontend shell.

Your task is to implement **Issue #37 — Safety Inspection Recording** as one vertical slice across the backend and frontend.

## Existing project materials

Please read these files before starting:

- `ISSUE-37.md` — product issue and acceptance criteria
- `ARCHITECTURE.md` — project structure and architecture notes
- `API_STYLE_GUIDE.md` — preferred backend conventions
- `CONTRIBUTING.md` — expected workflow and definition of done

## Core feature requirements

The application is used to record safety inspections at factory locations.

There are two user roles:

- Manager
- Inspector

For this assessment, inspections only need two statuses:

- Yet to Start
- Completed

### Manager requirements

Managers should be able to:

1. Create a new inspection
2. View all inspections
3. Assign a `Yet to Start` inspection to an Inspector

### Inspector requirements

Inspectors should be able to:

1. View inspections assigned to them
2. Complete a `Yet to Start` inspection by recording:
   - Location being inspected
   - Start date and time
   - Duration
   - Pass or Fail
   - Comments

### Technical requirements

Backend:

- Add appropriate TypeORM entities / fields
- Add REST API endpoints
- Use DTO validation where appropriate
- Restrict API access by role
- Prevent Inspectors from accessing or modifying inspections assigned to other Inspectors

Frontend:

- Add a simple functional UI for the workflow
- Use Bootstrap or plain HTML/CSS
- Do not spend time on visual polish

Git:

- Use a feature branch
- Make logical commits
- Complete a short PR-style summary in `SUBMISSION.md`

AI tools:

- You may use AI tools such as ChatGPT Codex or Claude Code
- You must understand all submitted code
- Briefly note in `SUBMISSION.md` where AI helped and how you reviewed the output

## Code review exercise

Spend no more than 10 minutes reviewing:

```text
backend/src/legacy/legacy.ts
```

Add brief notes to `CODE_REVIEW.md`. You do not need to fix this file.

## Do not spend time on

- Password reset
- Email verification
- Advanced styling
- Pagination
- Search/sort/filter beyond what is necessary
- CI/CD
- Production deployment
- Extensive automated tests
- Mobile app implementation

## Submission

Please submit:

1. Your completed repository or feature branch
2. Completed `SUBMISSION.md`
3. Completed `CODE_REVIEW.md`
4. A short 3–5 minute walkthrough video or live walkthrough during the follow-up interview
