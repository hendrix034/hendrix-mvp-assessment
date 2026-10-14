# Code Review Exercise

Spend no more than 10 minutes reviewing `backend/src/legacy/legacy.ts`.

You do not need to fix the code. Add brief notes below describing issues you noticed and what you would improve.

## Notes

### SECURITY
- trusts client-supplied 'role' and 'userid' that anyone can send random role or another userid to bypass the check. Identity and role must come from the token and never from request body

### Validation
- Status check is not flexible. it only rejects 'completed'. it should required 'yet to start' explicity so new statuses or unassigned inspections don't slip through
- the validation of (input.duration < 0) is weak. because there is on DTOs. the duration could be NaN and return it as false.

### Code Quality
- Return  {ok: false, message} instead of throwing Nest HTTP exceptions, so every failure is a 200, Use 'NotFoundException', 'ForbiddenException', 'BadRequestException' or any other exception that can fit on the expected error.
- Async with no await
