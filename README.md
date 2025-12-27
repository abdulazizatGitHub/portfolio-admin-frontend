# Portfolio Admin Panel Frontend

Admin panel frontend for managing portfolio content dynamically.

## Tech Stack

- **Next.js**: 15.x (App Router)
- **TypeScript**: 5.x (strict mode)
- **Tailwind CSS**: v4
- **State Management**: TanStack Query v5
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── forms/       # Form components
├── lib/             # Utilities and helpers
│   ├── api/         # API client
│   ├── hooks/       # Custom React hooks
│   ├── utils/       # Utility functions
│   └── data/        # Mock data
└── types/           # TypeScript type definitions
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXTAUTH_URL` - Frontend URL (for future auth)
- `NEXTAUTH_SECRET` - Secret key (for future auth)

## Development Status

Currently in development. Modules are being implemented step by step.

