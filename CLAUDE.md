# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

**Note:** This project uses pnpm as the package manager, not npm.

## Architecture Overview

This is a Next.js 15 React 19 application built with TypeScript that displays a financial dashboard for cryptocurrency trading backtest results. The application uses a retro "Nyan Cat" theme with pixel art styling.

### Key Components

- **Main Dashboard** (`app/page.tsx`): Single-page application displaying backtest results with interactive charts, position tables, and modal dialogs
- **UI Components** (`components/ui/`): Comprehensive shadcn/ui component library with custom theming
- **Data Layer** (`data/backtest-data.json`): Static JSON file containing all backtest results including positions, equity curve, and performance metrics
- **Types** (`lib/types.ts`): TypeScript interfaces for all data structures including Position, Summary, Config, etc.

### Styling Architecture

- **Tailwind CSS**: Primary styling framework with custom pixel art theme
- **Custom Colors**: Nyan Cat themed color palette (nyan-pink, nyan-blue, nyan-yellow, etc.)
- **Pixel Borders**: Custom CSS classes for retro pixel art styling
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Data Flow

The application is entirely client-side with no backend API. All data is imported from static JSON files:
- Backtest results are loaded from `data/backtest-data.json`
- The data includes trading positions, equity curve points, performance metrics, and ML prediction results
- Charts are rendered using Recharts library with custom rainbow gradients

### Key Features

1. **Interactive Charts**: Equity curve visualization with custom tooltips and rainbow gradient fills
2. **Sortable Position Table**: Click-to-sort functionality for all position metrics
3. **Position Details Modal**: Detailed view of individual trades with entry/exit data
4. **Performance Metrics**: Summary cards showing returns, win rate, drawdown, etc.
5. **Feature Importance**: Bar chart showing ML model feature weights
6. **QR Code Integration**: Modal with QR code for mobile app access

### Technology Stack

- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS with custom theme
- Recharts for data visualization
- Radix UI primitives via shadcn/ui
- Lucide React for icons

### File Structure Notes

- `app/` - Next.js app directory with main page and global styles
- `components/` - Reusable UI components (shadcn/ui based)
- `lib/` - Utility functions and TypeScript type definitions
- `data/` - Static JSON data files
- `public/` - Static assets including Nyan Cat GIF and QR codes