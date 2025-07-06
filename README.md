# ComposeForge

A modern marketplace for discovering, sharing, and generating high-quality Material 3 components for Jetpack Compose.

## Overview

ComposeForge is a component marketplace that helps Android developers build beautiful Material 3 interfaces faster by providing instant access to production-ready Jetpack Compose components with AI-powered generation capabilities.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Supabase (PostgreSQL with pgvector)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Component Preview**: Cloudflare Workers (planned)

## Architecture

This project uses a simplified, Next.js-native architecture that prioritizes developer experience and rapid development.

📖 **For detailed architectural information, see [Architecture Overview](docs/architecture/architecture-overview.md)**

### Quick Overview

```
src/
├── app/        # Next.js pages and routing
├── components/ # Shared UI components
├── lib/        # Business logic and utilities
├── hooks/      # Shared React hooks
└── config/     # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/compose-forge-web.git
cd compose-forge-web
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable UI components
- `/lib/services` - Business logic functions
- `/lib/supabase` - Database utilities
- `/hooks` - Custom React hooks

## Features

- 🔍 Component search and discovery
- 👤 User authentication and profiles
- 🤖 AI-powered component generation (coming soon)
- 👁️ Live component preview (coming soon)
- ⭐ Component ratings and favorites
- 📦 Component collections/libraries

## Contributing

Please read our contributing guidelines before submitting PRs.

## License

[License Type] - see LICENSE file for details