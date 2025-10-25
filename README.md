# Next Dashboard (Figma Glass)

Stack: Next.js 14 (App Router) + Tailwind + Chart.js + Prisma (Postgres).

## Rodar local
1. `npm i`
2. Crie `.env` copiando `.env.example` e defina `DATABASE_URL` para seu Postgres (Neon/Supabase/Vercel Postgres).
3. `npm run db:push` (cria as tabelas no DB)
4. `npm run db:seed` (dados de exemplo)
5. `npm run dev`

## Deploy Vercel
1. Faça push do repo para o GitHub.
2. Importe no Vercel.
3. Em **Environment Variables**, crie `DATABASE_URL` (Postgres).
4. Build & Deploy.

Rotas:
- `GET /api/metrics` — retorna métricas (12 meses)
- `POST /api/metrics` — upsert `{ monthIndex, value2022, value2023, value2024, month }`
