# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## About the project

**Migles** is a multiplataform (mobile + web) social event management app. It allows groups of friends and communities to organize events with RSVPs, waitlists, and member management. It is NOT a messaging platform - it complements WhatsApp/Telegram by organizing what happens outside them.

## Spec Driven Development

All development starts from specs in `docs/`. Changes to the product must be reflected in `docs/spec-v1.md` before (or alongside) becoming code.

## Monorepo structure

pnpm workspaces. Current layout:

```
migles/
├── src/       - Next.js web app
├── supabase/  - SQL migrations and Supabase config
├── docs/      - Product and design specs
├── app/       - React Native mobile (future)
└── packages/  - Shared packages (future)
```

## Web (`src/`)

**Stack:** Next.js 15 · TypeScript (strict) · Tailwind CSS · shadcn/ui · Supabase · TanStack Query · Zod · React Hook Form

**Commands (run from project root):**

```bash
npm run dev           # start dev server at localhost:3000
npm run build         # production build
npm run lint          # ESLint
npm run format        # Prettier
npm run db:link       # link Supabase CLI to remote project
npm run db:push       # apply pending migrations to remote DB
npm run db:seed       # create default test user (requires SUPABASE_SERVICE_ROLE_KEY)
```

**Folder structure:**

```
src/
  app/                 - Next.js App Router (routes only - no business logic)
    (protected)/       - authenticated routes (events, communities, profile)
    api/               - API routes (server-side operations requiring service role)
    i/[code]/          - event invite page (public)
    login/             - login and signup
    reset-password/    - password recovery
    u/[username]/      - public user profile by username
  features/            - feature-based modules (UI + logic co-located by domain)
  components/          - shared UI components
  schemas/             - Zod validation schemas (single source of truth per entity)
  services/            - data access layer (Supabase queries, no UI concerns)
  hooks/               - shared custom hooks
  lib/                 - auth context, upload helpers, utilities
  integrations/        - Supabase clients and generated types
```

**Environment:** copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, for seed only)

## Architecture rules

**Components**

- Default to Server Components; only add `"use client"` when the component requires hooks, event handlers, or browser APIs.
- Keep components small and focused. Fat pages and god hooks are bugs in the architecture.
- Pass data down as props; avoid prop drilling beyond two levels - use context or co-location instead.
- Prefer composition over inheritance.

**Business logic**

- Keep business logic outside components. Pages and components orchestrate; services and hooks do the work.
- Services (`src/services/`) handle all Supabase queries and data transformations - no direct Supabase calls inside components.
- Use Server Actions for mutations when possible; fall back to API routes only when a server action is insufficient.

**State management**

- Use TanStack Query for all async client-side state (fetching, caching, invalidation).
- Do not use `useEffect` + `fetch` inside components - use `useQuery` or Server Components instead.

**Validation**

- Validate all external input (forms, API responses, URL params) with Zod.
- Define schemas in `src/schemas/` and reuse them across forms and API routes - no duplicated schemas.
- Use React Hook Form with Zod resolvers for all user-facing forms.

## Database

Supabase (PostgreSQL) with Row Level Security. Migrations in `supabase/migrations/`, applied via `npm run db:push`.

Tables: `profiles`, `communities`, `community_members`, `events`, `event_organizers`, `rsvps`, `event_comments`.

Notable columns added recently: `profiles.username` (unique, used in `/u/[username]` routes), `communities.slug` (unique, URL-friendly identifier).

## Key domain rules

- An event must always have at least one organizer
- Waitlist promotion is automatic (FIFO) when a confirmed participant cancels
- RSVP states: `pending` -> `confirmed` | `declined` | `waitlisted`
- Event visibility: `private` (invited only) or `community` (community members)
- Community member status: `ACTIVE` | `PENDING` | `BANNED` - banned users cannot rejoin by any mechanism
- Only community admins can create events linked to a community

## Open architectural decisions

See `docs/spec-v1.md` section 10 for open questions, notably:

- Push notification provider (Q3) - pending
- Event visibility outside community (Q4) - pending
