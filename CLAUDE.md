# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the project

**Migles** is a multiplataform (mobile + web) social event management app. It allows groups of friends and communities to organize events with RSVPs, waitlists, and member management. It is NOT a messaging platform - it complements WhatsApp/Telegram by organizing what happens outside them.

## Spec Driven Development

All development starts from specs in `specs/`. Changes to the product must be reflected in `specs/spec-v1.md` before (or alongside) becoming code.

The `specs/backend.md` file is the backend setup prompt/spec.

## Monorepo structure

pnpm workspaces. Planned layout:

```
migles/
├── api/       - NestJS backend
├── mobile/    - React Native
├── web/       - React
└── packages/  - shared packages
```

## Backend (`api/`)

**Stack:** NestJS · TypeScript (strict) · Prisma · PostgreSQL · Zod · BullMQ + Redis · Vitest

**Commands (run from `api/`):**

```bash
pnpm dev              # start with watch mode
pnpm build            # compile
pnpm test             # run tests with Vitest
pnpm test:coverage    # coverage report
pnpm db:migrate       # prisma migrate dev
pnpm db:generate      # regenerate Prisma client
pnpm db:studio        # open Prisma Studio
pnpm db:seed          # run prisma/seed.ts
```

**Module structure** (`api/src/modules/`): `auth`, `users`, `events`, `communities`, `rsvp`, `comments`. Each module follows the pattern: `module · controller · service · repository · schema (Zod) · types`.

**Shared** (`api/src/shared/`): `database` (Prisma service), `queue` (BullMQ workers for waitlist promotion and notifications), `guards`, `decorators`, `utils`.

**Key domain rules:**
- An event must always have at least one organizer
- Waitlist promotion is automatic (FIFO) when a confirmed participant cancels
- RSVP states: `pending` → `confirmed` | `declined` | `waitlisted`
- Event visibility: `PRIVATE` (invited only) or `COMMUNITY` (community members)
- Community member status: `ACTIVE` | `PENDING` | `BANNED` - banned users cannot rejoin by any mechanism
- Only community admins can create events linked to a community

**Environment:** copy `api/.env.example` to `api/.env` and fill in `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, and OAuth credentials before running.

## Open architectural decisions

See `specs/spec-v1.md` section 10 for open questions, notably:
- REST vs GraphQL (Q1) - not yet decided
- Monorepo vs separate repos (Q2) - decided: monorepo
- Push notification provider (Q3) - pending
