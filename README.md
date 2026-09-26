# Financy

Fullstack personal finance app with authentication, categories, and transactions.

## Stack

- Node.js `v24.21.0`
- Backend: TypeScript, GraphQL Yoga, Prisma, SQLite, JWT, CORS
- Frontend: React, Vite, TypeScript, React Query, React Hook Form, Zod, Twind

## Project Structure

```text
ftr-pos360-financy/
  backend/
  frontend/
  LICENSE
  README.md
  .gitignore
  .nvmrc
```

## Backend

GraphQL API with ownership checks for all private resources.

### Environment

Copy and fill environment variables from `backend/.env.example`:

```env
JWT_SECRET=your_jwt_secret_here
DATABASE_URL="file:./dev.db"
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### Install and Run

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Scripts

- `npm run dev`: run server in watch mode
- `npm run build`: compile TypeScript
- `npm run start`: run compiled server
- `npm run test`: run unit tests
- `npm run test:watch`: run tests in watch mode

## Frontend

React single-page app with authenticated screens for dashboard, categories, transactions, and profile.

### Environment

Copy and fill environment variables from `frontend/.env.example`:

```env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

### Install and Run

```bash
cd frontend
npm install
npm run dev
```

### Scripts

- `npm run dev`: run Vite dev server
- `npm run build`: type-check and build for production
- `npm run preview`: preview production build

## Ownership and Security Rules

- Only authenticated users can access private operations.
- Categories can only be listed/created/updated/deleted by their owner.
- Transactions can only be listed/created/updated/deleted by their owner.
- Transaction category must belong to the same authenticated user.

## Unit Tests

Backend unit tests cover:

- Auth service (password hashing/comparison and JWT roundtrip)
- Category service ownership rules
- Transaction service ownership rules and category validation

Run:

```bash
cd backend
npm run test
```

## Coverage Report

Latest coverage summary:

- Frontend: 97.30% statements, 82.30% branches, 97.98% functions
- Backend: 99.40% statements, 92.19% branches, 100.00% functions
- Combined: 98.41% statements, 84.62% branches, 98.45% functions
