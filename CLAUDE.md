# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # Install deps + generate Prisma client + run migrations
npm run dev          # Start dev server (Next.js + Turbopack) at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests (Vitest)
npx vitest run src/path/to/file.test.ts  # Run a single test file
npm run db:reset     # Reset and re-migrate the SQLite database
```

The dev script requires `NODE_OPTIONS='--require ./node-compat.cjs'` — this is already included in all npm scripts. Do not invoke `next dev` directly without it.

## Architecture

UIGen is an AI-powered React component generator. Users describe components in a chat interface; the AI generates code into a **virtual file system** (in-memory, no disk writes); a live preview iframe renders the result.

### Request / Response Flow

1. **Frontend** (`ChatInterface`) collects messages + serializes the current `VirtualFileSystem` state, then POSTs to `/api/chat`.
2. **API route** (`src/app/api/chat/route.ts`) reconstructs the VFS, calls the Vercel AI SDK `streamText` with two tools:
   - `str_replace_editor` — create/str_replace/insert operations on files
   - `file_manager` — rename/delete operations
3. The AI streams tool calls back. The **`FileSystemContext`** (`src/lib/contexts/file-system-context.tsx`) intercepts each tool call via `handleToolCall` and mutates the in-memory VFS.
4. On finish, if the user is authenticated and a `projectId` is present, messages + serialized VFS are persisted to SQLite via Prisma.

### Virtual File System

`VirtualFileSystem` (`src/lib/file-system.ts`) is an in-memory tree of `FileNode` objects (files and directories). It is instantiated fresh on each API request from serialized JSON (`deserializeFromNodes`), and serialized back via `serialize()` for persistence. The context wraps a single VFS instance per session.

### Live Preview

`PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) renders an `<iframe srcdoc>`. On every `refreshTrigger` change:

1. All VFS files are passed to `createImportMap` (`src/lib/transform/jsx-transformer.ts`), which Babel-transforms each `.jsx/.tsx` file to plain JS and creates `blob://` URLs.
2. An ES module import map is injected into the iframe HTML, mapping `@/` aliases and bare specifiers (via `https://esm.sh`) to blob URLs.
3. The iframe bootstraps React 19 + the entry point (`/App.jsx` by default) as a module script.

Third-party packages not in the VFS are auto-resolved from `esm.sh`. Missing local imports get placeholder stub components to avoid hard crashes.

### Auth

JWT-based session auth via `jose` (`src/lib/auth.ts`). Sessions stored in an `httpOnly` cookie (`auth-token`). The JWT secret defaults to `"development-secret-key"` if `JWT_SECRET` is not set. The middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem` routes. Anonymous users can still generate — their work is tracked in `sessionStorage` (`src/lib/anon-work-tracker.ts`) and can be saved after sign-up.

### AI Provider

`getLanguageModel()` (`src/lib/provider.ts`) returns:
- **Real**: `claude-haiku-4-5` via `@ai-sdk/anthropic` when `ANTHROPIC_API_KEY` is set.
- **Mock**: `MockLanguageModel` (static multi-step responses) when no key is present. The mock uses fewer `maxSteps` (4 vs 40) to prevent repetition.

### Database

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of data stored in the database.

Prisma + SQLite (`prisma/dev.db`). Schema has two models:
- `User` — email/password accounts
- `Project` — stores serialized messages (`String`) and VFS data (`String`) as JSON blobs, optionally linked to a user (`userId` nullable for anonymous projects).

Generated Prisma client outputs to `src/generated/prisma/` (not the default location).

### Code Style

Use comments sparingly. Only comment complex or non-obvious code.

### Key Conventions

- All generated components **must** have `/App.jsx` as the root entry point with a default export.
- Internal imports in generated code use `@/` as an alias to the VFS root (e.g., `import Foo from '@/components/Foo'`).
- Style with Tailwind CSS only — no hardcoded styles in generated components.
- Tests use Vitest + jsdom + React Testing Library. Test files live adjacent to their components in `__tests__/` subdirectories.
