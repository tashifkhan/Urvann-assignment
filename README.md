## Urvann — Plant storefront (Next.js)

A [small e-commerce-like demo](https://urvann-assignment-three.vercel.app/) for browsing and managing plants built with Next.js 13 (App router), TypeScript and TailwindCSS. It includes a public listing, search, filters, pagination and a simple admin area with API routes backed by MongoDB.

This README covers project structure, local setup, common scripts, API surface, data shapes, and quick developer notes.

## Quick facts

- Framework: Next.js 13 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- DB: MongoDB (used in server-side API routes)
- Package manager: pnpm (project contains `pnpm-lock.yaml`) — npm or yarn will work but commands below show pnpm

## Requirements

- Node.js (recommended 18+)
- pnpm (or npm/yarn)
- A MongoDB instance for the API routes that persist plants

## Setup (local)

1. Install dependencies

```bash
pnpm install
# or: npm install
```

2. Create environment variables

Create a `.env.local` in the project root. The project uses environment variables for MongoDB and JWT secrets. Reasonable names and usage (inferred):

```
MONGODB_URI="your-mongodb-connection-string"
JWT_SECRET="a-strong-secret"
# OPTIONAL (if you want an explicit external API base): NEXT_PUBLIC_API_URL=http://localhost:3000
```

Note: If your local mongo uses a different variable name, adapt the code in `lib/mongo.ts` and any server code that imports it.

3. Run the dev server

```bash
pnpm dev
# open http://localhost:3000
```

## Available scripts

These are defined in `package.json`.

- `dev` — start Next.js in development mode
- `build` — build the production app
- `start` — run the built app
- `lint` — run ESLint

Example (build + start):

```bash
pnpm build
pnpm start
```

## Project layout (high level)

Top-level folders and notable files:

- `app/` — Next.js App Router pages and API
  - `page.tsx` — home page that fetches `/api/plants` and renders the plant grid
  - `admin/` — admin pages (login, list, create/edit)
  - `api/` — serverless API routes used by the frontend (`/api/plants`, `/api/login`, and ID routes)
- `components/` — React UI components, split by feature (admin, plants, layout, ui primitives)
- `lib/` — client/server utilities (API client, mongo helpers, categories, formatters)
- `data/` — sample or static data (e.g. `plants.ts`)
- `types/` — TypeScript types (e.g. `plant.ts`)

Explore the `components/` folder for building blocks used across pages (Header, Footer, PlantGrid, PlantCard, forms, etc.).

## API surface

The app exposes a small set of API routes under `app/api/`:

- `GET /api/plants` — returns a list (or paginated set) of plants. The front page fetches this and expects a JSON payload with an `items` array.
- `GET|POST /api/plants/:id` — (server handlers under `app/api/plants/[id]/route.ts`) manage individual plant operations.
- `POST /api/login` — simple auth endpoint used by the admin UI to obtain a token/session.

These routes are implemented as server routes using Next.js route handlers. They use utilities from `lib/` to talk to MongoDB.

## Data shape — Plant (summary)

The codebase references a `Plant` type in `types/plant.ts`. The UI expects each plant object to include at least the following fields (the front-end gracefully handles missing fields):

- `id` | string — unique identifier
- `name` | string
- `price` | number
- `categories` | string[]
- `stock` | number
- `imageUrl` | string
- `description` | string
- `careTips` | string
- `createdAt` | string | Date
- `featured` | boolean

When the client maps server responses it uses fallback/defaults in `app/page.tsx` to ensure robust rendering.

## Admin area

- The admin pages are located under `app/admin`. There's a `login` page, an index admin page and plant create/edit pages under `app/admin/plants/`.
- The admin UI uses client-side forms (see `components/admin/PlantForm.tsx`) and hits the API routes for CRUD operations.

Authentication: the project includes JWT/token related packages (`jsonwebtoken`, `jose`) and a `POST /api/login` route — update `JWT_SECRET` and any login logic for production.

## Styling and UI

- Tailwind CSS is used for styling (see `tailwind.config.ts` and `app/globals.css`).
- The project includes a set of reusable UI primitives under `components/ui/` (buttons, inputs, select, dialog, etc.).

## Useful developer notes

- Data fetching: the main page (`app/page.tsx`) fetches `/api/plants` client-side with fetch and maps fields to the `Plant` shape.
- Pagination, sorting and filtering are implemented in `lib/plant-utils.ts` and used by the UI (search, category select, sort select and pagination control).
- If you want to seed data locally, `data/plants.ts` contains sample plant items you can adapt and load into MongoDB.
- The repo uses TypeScript — keep IDE type-checking enabled. There is an existing `tsconfig.json`.
