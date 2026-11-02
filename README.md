# ApexDrive

Self-drive car rental demo built from the attached `index.html` reference: React + TypeScript + Vite frontend, Express + TypeScript backend, PostgreSQL via Prisma.

> ⚠️ **Demo only.** No payment is collected, no real car is reserved, and the "verification" for booking lookup is not production-grade. Do not use with real customer data.

## Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally (or a connection string to a hosted instance)
- npm 10+

## Setup

```bash
# 1) Install
npm install

# 2) Configure environment
cp .env.example .env
# edit DATABASE_URL if your Postgres credentials differ

# 3) Create the database (example using psql)
createdb apexdrive    # or: psql -c "CREATE DATABASE apexdrive;"

# 4) Apply migrations and generate Prisma client
npm run migrate

# 5) Seed cities + 21 cars + starter reviews
npm run seed

# 6) Start backend (:4000) and frontend (:5173) together
npm run dev