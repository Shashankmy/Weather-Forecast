# Project Architecture

This document provides an overview of the Weather Forecast Web Application architecture.

## Overview

The application follows a client-server architecture:

- **Frontend**: React + TypeScript application using Vite for development
- **Backend**: Express.js server for API endpoints and server-side rendering
- **Database**: PostgreSQL for data persistence

## Component Structure

### Frontend

```
client/src/
├── assets/           # Static assets and icons
├── components/       # Reusable UI components
│   ├── city-table/   # City listing and search components
│   ├── layout/       # Layout components (header, footer)
│   ├── ui/           # Base UI components (shadcn/ui)
│   └── weather/      # Weather-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and API clients
├── pages/            # Page components
│   └── weather/      # Weather detail pages
└── types/            # TypeScript type definitions
```

### Backend

```
server/
├── index.ts          # Express application entry point
├── routes.ts         # API route definitions
├── storage.ts        # Data access interface
├── db.ts             # Database connection
└── vite.ts           # Vite integration for serving frontend
```

### Shared

```
shared/
└── schema.ts         # Database schema and types (Drizzle ORM)
```

## Data Flow

1. User requests data through the frontend UI
2. React components call API endpoints through custom hooks
3. Express server handles API requests
4. Server retrieves/stores data using the storage interface
5. For external data (weather), server makes requests to third-party APIs
6. Data is returned to the frontend and rendered in the UI

## Key Technologies

- **Frontend Framework**: React 18
- **State Management**: React Query
- **Routing**: Wouter
- **Styling**: TailwindCSS + shadcn/ui components
- **Form Handling**: React Hook Form + Zod validation
- **API Communication**: Fetch API with custom wrapper
- **Database ORM**: Drizzle ORM
- **Server**: Express.js

## API Integration

The application integrates with two external APIs:

1. **OpenDataSoft**: Used for city data and search
2. **OpenWeatherMap**: Used for current weather and forecasts

API keys are stored as environment variables and used server-side to protect credentials.

## Deployment Architecture

The application is designed to be deployed as a monolithic application where:

1. The frontend is built as static assets
2. The backend serves both the API endpoints and the static assets
3. A PostgreSQL database is used for data persistence

This approach simplifies deployment to platforms like Heroku, Vercel, Railway, etc.