# EngL App

A modular React learning platform with Redux Toolkit, Axios, Tailwind CSS, PWA support, and mock API.

## Features

- Modular, clean structure
- State management with Redux Toolkit
- Axios with interceptors
- Custom-styled Tailwind CSS
- Mock API using JSON Server
- Custom hooks for auth, lessons, progress, UI
- Linting & formatting (ESLint + Prettier)
- PWA with service worker
- Recharts for analytics
- Ready for CI/CD & deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Install dependencies

```bash
npm install
```

### Start the development environment

You need to run both the React app and the mock API server simultaneously:

**Terminal 1 - Start the mock API:**
```bash
npx json-server --watch server/db.json --port 5000
```

**Terminal 2 - Start the React app:**
```bash
npm start
```

The React app will be available at: http://localhost:3000
The mock API will be available at: http://localhost:5000

### Demo Credentials

Use these credentials to test the authentication:

- **Email:** john@example.com / **Password:** password123
- **Email:** jane@example.com / **Password:** password123

### Features Included

- ✅ User Authentication (Login/Register)
- ✅ Dashboard with progress tracking
- ✅ Interactive lessons with search/filtering
- ✅ Quiz system with scoring
- ✅ Speaking practice with Web Speech API
- ✅ User profile management
- ✅ Responsive design with modern UI
- ✅ Redux state management
- ✅ API integration with error handling

## Project Structure

- `src/` - Main source code
  - `components/` - Reusable UI components
  - `context/` - Redux store and slices
  - `hooks/` - Custom React hooks
  - `services/` - API and business logic
  - `DashboardPage.jsx`, `LessonsPage.jsx`, etc. - Main pages
- `server/db.json` - Mock API data
- `public/service-worker.js` - PWA service worker

## Scripts

- `npm start` - Start React app
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## API

See [`API_DOCS.md`](API_DOCS.md) for endpoint details.
