# Visa Services CRM

AI-first Visa Operations & Client Management Platform for Go Source Placement Services.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL 8.x with Prisma ORM
- **Auth**: JWT with HttpOnly cookies, bcrypt password hashing

## Prerequisites

- Node.js >= 18
- MySQL 8.0+
- npm >= 9

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
copy .env.example backend\.env
# Edit backend\.env with your database credentials
```

### 3. Start MySQL and setup database

```bash
docker compose up -d mysql
npm run db:generate
npm run db:push
npm run db:seed
```

For local dashboard previews, add clearly marked demo records without replacing existing data:

```bash
npm run db:seed:demo
```

This command is idempotent and refuses non-local or production databases.

### 4. Start backend and frontend separately

Open two terminals at the project root.

Terminal 1:
```bash
npm run dev:backend
```

Terminal 2:
```bash
npm run dev:frontend
```

- API: http://localhost:3000
- Web: http://localhost:5173

You can also run each app from its own directory with `npm run dev`.
The combined command `npm run dev` starts both apps together.

### Using Docker

```bash
docker compose up -d
```

## Deploying to Vercel with MySQL

Use a managed MySQL 8-compatible database reachable from Vercel. Set these backend environment variables in the Vercel project:

- `DATABASE_URL`: `mysql://USER:PASSWORD@HOST:PORT/DATABASE` (URL-encode special characters in credentials)
- `JWT_SECRET`: a strong, unique secret
- `COOKIE_SECRET`: a strong, unique secret
- `FRONTEND_URL`: the deployed frontend origin, such as `https://your-frontend.vercel.app`
- `NODE_ENV`: `production`

Keep credentials out of Git. The backend generates Prisma Client during install and exports its Express app for Vercel. If the frontend and backend are deployed as separate Vercel projects, set `VITE_API_URL` in the frontend project to the backend's production origin (for example, `https://your-backend.vercel.app`) and redeploy the frontend. The frontend adds `/api/v1` automatically; you can also provide the full API base URL. If both services share one Vercel deployment with the `vercel.json` rewrites, leave `VITE_API_URL` unset and the relative `/api/v1` path will be routed to the backend.

Before deploying against a new MySQL database, apply the checked-in migrations from the repository root with `npm run db:migrate:deploy` while `DATABASE_URL` points to that database. This applies migrations and does not create or provision the database itself.

## Project Structure

```
backend/       # Express + TypeScript API and Prisma schema
frontend/      # React + Vite web app
docker-compose.yml
package.json
```

## Default Login

- Email: `admin@gosource.com`
- Password: `Admin@123`

## API Conventions

- All routes under `/api/v1/`
- Response: `{ success: true, data }` or `{ success: false, error: { code, message } }`
- Pagination: `?page=1&limit=20`
- Auth via HttpOnly JWT cookie

## License

Proprietary - Go Source Placement Services
