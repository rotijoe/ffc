### Contributing Notes

This project uses TSDoc-friendly, self-documenting code and small focused modules. A few conventions:

## Code Style

- Functional, typed React components (`function Component()`)
- Early returns, guard clauses, minimal nesting
- Descriptive names; avoid abbreviations and magic numbers
- Tailwind for styling; avoid CSS files

## File Layout

- Pages in `src/app/**` (App Router)
- UI in `src/components/**` with `index.tsx`, `helpers.ts`, `constants.ts`, `types.ts`
- Domain and infra in `src/lib/**`
- Hooks in `src/hooks/**`

## Tests

- Run: `npm test`, `npm run test:watch`, `npm run test:coverage`
- Keep hooks and helpers covered; aim for high signal assertions via Testing Library

## Supabase Types

- After schema/RPC changes, regenerate types and commit:

```bash
npm run db:types       # hosted project (needs SUPABASE_PROJECT_ID)
npm run db:types:local # local stack
```

## Common Tasks

- Add pagination or sorting: prefer small helpers in `src/lib/api-helpers.ts` and `src/components/**/helpers.ts`
- Add UI: build small parts, lean on Shadcn/Radix primitives, keep logic in helpers
