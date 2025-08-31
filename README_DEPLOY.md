# Deploy a Vercel

## Requisitos
- Node 20.x (engines en package.json)
- Variables: `DATABASE_URL`, `JWT_SECRET`, `VITE_API_URL=/api`

## Local
```bash
npm ci
npm run build
npm run dev   # vercel dev
# GET http://localhost:3000/api/health -> 200
