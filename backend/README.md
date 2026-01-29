# License Backend (Full CRUD) + Payment Required Before Approve

## Setup
1. Copy `.env.example` to `.env` and edit values.
2. Install deps:
   - `npm install`
3. Run:
   - `npm run dev`

## Key Rule
- Admin cannot approve a license request unless there is a Payment with `status=PAID` for that `requestId`.

## Endpoints
- `/api/auth/register`, `/api/auth/login`
- `/api/requests` (user token required)
- `/api/payments`
- `/api/admin/requests` (admin token required)
