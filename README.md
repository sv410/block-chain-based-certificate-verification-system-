# Chain-Verify

A full-stack blockchain-inspired certificate verification platform.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- Backend: Express + TypeScript
- Database: PostgreSQL + Drizzle ORM

## Features

- Issue digital certificates
- Verify certificates by hash
- Revoke-aware validation flow
- Dashboard and verification pages
- Shared API contracts with Zod validation

## Project Structure

```text
client/   React application
server/   Express API and server bootstrap
shared/   Shared schemas and API route contracts
script/   Build scripts
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
PORT=5000
```

## Installation

```bash
npm install
```

## Database Setup

Push the schema to your database:

```bash
npm run db:push
```

## Run Locally

### Development

```bash
npm run dev
```

If your shell does not support inline environment variables (common on Windows PowerShell), use:

```powershell
$env:NODE_ENV="development"
npx tsx server/index.ts
```

### Production Build

```bash
npm run build
npm start
```

## Useful Scripts

- `npm run dev` — start dev server
- `npm run build` — build client + server
- `npm start` — run production build
- `npm run check` — TypeScript type check
- `npm run db:push` — push Drizzle schema to PostgreSQL

## API Endpoints

- `GET /api/certificates` — list certificates
- `GET /api/certificates/:hash` — get certificate by hash
- `POST /api/certificates` — create a certificate
- `POST /api/certificates/verify` — verify by certificate hash

### Sample Verify Request

```json
{
  "hash": "your-certificate-hash"
}
```

## License

MIT (see [LICENSE](LICENSE)).