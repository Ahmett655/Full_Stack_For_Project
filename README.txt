FULLSTACK (Backend original + Frontend built to match)

BACKEND:
- cd backend
- npm install
- npm run dev

IMPORTANT: backend package.json now includes pdfkit. Run npm install to fetch it.
Set .env (backend/.env) based on .env.example (if exists) and provide:
- MONGO_URI
- JWT_SECRET
- PORT (optional)

FRONTEND:
- cd frontend
- npm install
- npm run dev
Optional: create frontend/.env with:
VITE_API_URL=http://localhost:5000

FLOW:
User: create request -> pay -> wait approval -> download PDF.
Admin: view requests -> approve/reject (approve only if paid).

PDF:
GET /api/requests/:id/pdf  (only owner + APPROVED + payment PAID)
