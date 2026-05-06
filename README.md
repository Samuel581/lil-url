# lil-url

> A URL shortener REST API built with NestJS, PostgreSQL, and JWT authentication.

![NestJS](https://img.shields.io/badge/NestJS-v11-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v7.7-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-package_manager-F69220?style=flat-square&logo=pnpm&logoColor=white)

> Live at: [your-deployment-url-here]

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Features

- **JWT Authentication** — register and login with email/password; tokens expire after 24 hours
- **URL Shortening** — auto-generates an 8-character code using nanoid
- **Custom Aliases** — optionally supply your own short code (4–32 alphanumeric chars, hyphens, underscores)
- **Link Expiration** — set an optional expiry date (ISO 8601, max 1 year from now)
- **Automatic Deactivation** — a daily cron job soft-deletes expired links at midnight
- **Click Count Tracking** — every redirect increments the link's click counter
- **Structured Error Handling** — a global `ValidationPipe` strips unknown fields and returns `400` on malformed input; a `PrismaExceptionFilter` maps database-level errors to meaningful HTTP status codes
- **Fully Containerized** — Docker Compose spins up the app and PostgreSQL with one command

---

## Tech Stack

| Layer          | Technology        | Version |
|----------------|-------------------|---------|
| Framework      | NestJS            | v11     |
| Language       | TypeScript        | v5.7    |
| Database       | PostgreSQL        | 17      |
| ORM            | Prisma            | v7.7    |
| Authentication | Passport.js + JWT | —       |
| Password Hash  | bcrypt            | v6      |
| Short Codes    | nanoid            | v5.1    |
| Runtime        | Node.js           | v22     |
| Package Mgr    | pnpm              | —       |
| Containers     | Docker / Compose  | —       |

---

## Getting Started

### Prerequisites

- **Node.js** v22+
- **pnpm** — `npm install -g pnpm`
- **Docker + Docker Compose** (recommended) _or_ a local PostgreSQL 17 instance

### Environment Variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

| Variable              | Required | Description                                           |
|-----------------------|----------|-------------------------------------------------------|
| `DATABASE_URL`        | Yes      | PostgreSQL connection string (used for local dev)     |
| `JWT_SECRET`          | Yes      | Secret key used to sign JWT tokens                    |
| `BCRYPT_SALT_ROUNDS`  | No       | bcrypt rounds (defaults to `10`)                      |
| `POSTGRES_USER`       | Docker   | PostgreSQL username (used by Docker Compose)          |
| `POSTGRES_PASSWORD`   | Docker   | PostgreSQL password (used by Docker Compose)          |
| `POSTGRES_DB`         | Docker   | PostgreSQL database name (used by Docker Compose)     |

> **Note:** When running the app locally against the Dockerized database, `DATABASE_URL` must use the same credentials you set in `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`:
> ```
> DATABASE_URL="postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5432/<POSTGRES_DB>?schema=public"
> ```
> Docker Compose builds this URL automatically for the app container (using `db` as the host), but for local dev you need to set it manually.

### Option A — Docker Compose (recommended)

Fill in the `POSTGRES_*` and `JWT_SECRET` variables in `.env`, then:

```bash
docker-compose up
```

This starts PostgreSQL on port `5432` and the API on port `3000`. Migrations run automatically on startup.

### Option B — Local Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure `.env`** with a valid `DATABASE_URL` pointing to your local PostgreSQL instance.

3. **Run migrations**

   ```bash
   npx prisma migrate deploy
   ```

4. **Start the development server**

   ```bash
   pnpm run start:dev
   ```

The API will be available at `http://localhost:3000`.

### Running Tests

```bash
# Unit tests
pnpm run test

# Unit tests in watch mode
pnpm run test:watch

# Coverage report
pnpm run test:cov

# End-to-end tests
pnpm run test:e2e
```

---

## Deployment

The project ships a multi-stage `Dockerfile` that produces a lean production image.

### Build & Run

```bash
docker build -t lil-url .

docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@db:5432/lil_url" \
  -e JWT_SECRET="a-strong-random-secret" \
  lil-url
```

The container automatically runs `prisma migrate deploy` before starting the server, so no manual migration step is needed.

### Environment Variables (Production)

| Variable       | Notes                                            |
|----------------|--------------------------------------------------|
| `DATABASE_URL` | Full PostgreSQL connection string                |
| `JWT_SECRET`   | Use a long, random string (min 32 chars advised) |

---

## Roadmap

- [ ] **Click analytics endpoint** — expose per-link click data via `GET /url/:shortCode/stats` (the `clickCount` field is already tracked in the database)
- [ ] **Rate limiting** — throttle `POST /url/shorten` to prevent abuse
- [ ] **Link management** — `GET /url` and `DELETE /url/:shortCode` so authenticated users can manage their own links
- [ ] **Refresh tokens** — issue short-lived access tokens alongside longer-lived refresh tokens
