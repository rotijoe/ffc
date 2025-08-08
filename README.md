# FFC - Next.js Project

A modern Next.js application built with TypeScript, Tailwind CSS, Shadcn UI, and Supabase.

## Features

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful and accessible components built with Radix UI
- **Supabase** - Database, RPC, and type-safe client integration
- **ESLint** - Code linting and formatting

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind imports
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── hero_section/     # Custom components following structure
│       ├── index.tsx     # Main component
│       ├── types.ts      # TypeScript types
│       ├── constants.ts  # Component constants
│       └── helpers.ts    # Helper functions
└── lib/
    ├── api-helpers.ts     # Fetch and pagination helpers
    ├── shops-api.ts       # Server-side API
    ├── shops-api-client.ts# Client-side API (incl. RPC)
    ├── supabase.ts        # Browser client
    ├── supabase-server.ts # Server client
    ├── types.ts           # Domain types
    ├── database.types.ts  # Generated DB types (do not edit)
    └── utils.ts           # Utility functions
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Documentation

- Architecture: see `ARCHITECTURE_OVERVIEW.md`
- Data flow & pagination: `DATA_FLOW_AND_PAGINATION.md`
- Distance/PostGIS setup: `DISTANCE_FEATURE_SETUP.md`
- Supabase workflow & types: `SUPABASE_WORKFLOW.md`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:types` - Regenerate types from hosted project (requires `SUPABASE_PROJECT_ID`)
- `npm run db:types:local` - Regenerate types from local Supabase

## Component Structure

Each component follows a consistent structure:

- `index.tsx` - Main component export
- `types.ts` - TypeScript interface definitions
- `constants.ts` - Component-specific constants
- `helpers.ts` - Utility functions and business logic

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [ShadCN UI](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Lucide React](https://lucide.dev/) - Icons
