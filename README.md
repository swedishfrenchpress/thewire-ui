# the-wire

Next.js 15 + TypeScript + Chakra UI v3 (App Router). Frontend for the Document
Grading API.

## Getting started

```bash
npm install
npm run dev
```

## Backend

By default the app talks to the hosted Railway backend:

```
https://the-wire-backend-production-267d.up.railway.app
```

To point at a different backend (e.g. a local `go run .`), set:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

in `.env.local`. Only `src/lib/api.ts` reads this — swap that file's
implementation if you need a different transport entirely.

## Routes

- `/` — upload one or more `.txt`/`.md` files. POSTs `/api/v1/cases`, then
  navigates to the dashboard with the returned case id.
- `/dashboard?case=<id>` — case overview. Lists the inferred categories sorted
  by triage (high → medium → low). Each row links into a category.
- `/category/[id]?case=<id>` — category detail. Renders the category-level
  heuristics and the documents inside it (filename, per-document heuristics,
  and raw content).

## Folder structure

```
the-wire/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Wraps app in Chakra + React Query providers
│   │   ├── page.tsx            # `/` upload
│   │   ├── dashboard/
│   │   │   └── page.tsx        # `/dashboard` case overview
│   │   └── category/
│   │       └── [id]/
│   │           └── page.tsx    # `/category/[id]` category detail + documents
│   ├── components/
│   │   ├── Provider.tsx        # ChakraProvider wrapper
│   │   └── QueryProvider.tsx   # React Query QueryClientProvider wrapper
│   ├── lib/
│   │   ├── api.ts              # The single network boundary
│   │   └── types.ts            # Wire-format TypeScript types
│   └── theme/
│       └── system.ts           # Chakra `createSystem` (inject tokens here)
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Theme

`src/theme/system.ts` exports the Chakra `system` built via
`createSystem(defaultConfig, config)`. The `config` object holds an empty
`tokens`/`semanticTokens` placeholder — replace it with Style Dictionary output
when ready.
