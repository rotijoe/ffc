# FFC - Next.js Project

A modern Next.js application built with TypeScript, Tailwind CSS, and ShadCN UI components.

## Features

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Beautiful and accessible components built with Radix UI
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
    └── utils.ts          # Utility functions
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

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
