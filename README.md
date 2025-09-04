# EngL App

A modular React learning platform with Redux Toolkit, Axios, Tailwind CSS, PWA support, and PostgreSQL database.

## Features

- Modular, clean structure
- State management with Redux Toolkit
- Axios with interceptors
- Custom-styled Tailwind CSS
- PostgreSQL database with Prisma ORM
- Custom hooks for auth, lessons, progress, UI
- Linting & formatting (ESLint + Prettier)
- PWA with service worker
- Recharts for analytics
- Ready for CI/CD & deployment

## Getting Started

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for detailed instructions on setting up the application for local development with PostgreSQL or Supabase.

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions on setting up Supabase for this project.

### Quick Start with Supabase (Recommended)

1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard
3. Update the credentials in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR_PROJECT_ID]:5432/postgres?schema=public"
   SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
   SUPABASE_KEY="YOUR_ANON_KEY"
   ```
4. Install dependencies and run migrations:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Run database migrations
   npx prisma migrate dev --name init
   npx prisma generate
   
   # Start the backend
   npm run dev
   ```
5. Start the React app (in a new terminal):
   ```bash
   npm start
   ```

### Quick Start with Docker (Alternative)

```bash
# Start all services (PostgreSQL, backend)
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma generate

# Start the React app
npm start
```

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
- `backend/` - Backend API with PostgreSQL database
  - `src/` - API source code
  - `prisma/` - Database schema and migrations
- `public/service-worker.js` - PWA service worker

## Scripts

- `npm start` - Start React app
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## API

See [`API_DOCS.md`](API_DOCS.md) for endpoint details.
