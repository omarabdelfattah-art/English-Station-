# English Station Backend

Backend API for the English Station learning platform.

## Prerequisites

- Node.js (v14 or higher)
- Supabase Account (https://supabase.com)

## Setup with Supabase (Recommended)

1. Create a Supabase account at https://supabase.com
2. Create a new project in your Supabase dashboard
3. Update the `DATABASE_URL`, `SUPABASE_URL`, and `SUPABASE_KEY` in the `.env` file with your Supabase credentials
4. Install dependencies:
   ```bash
   npm install
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## Alternative: Local PostgreSQL Setup

If you prefer to use a local PostgreSQL installation instead of Supabase:

1. Install PostgreSQL on your system
2. Create a new database for the application
3. Update the `DATABASE_URL` in the `.env` file with your local database credentials
4. Follow steps 4-7 above

## Database Configuration

The application can be configured to use either:
- Supabase PostgreSQL database (recommended for ease of setup)
- Local PostgreSQL database

The connection URL is configured in the `.env` file:

```
DATABASE_URL="postgresql://postgres:[YOUR_PROJECT_ID]:5432/postgres?schema=public"
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (Supabase or local)
- `SUPABASE_URL`: Supabase project URL (if using Supabase auth)
- `SUPABASE_KEY`: Supabase anon key (if using Supabase auth)
- `PORT`: Server port (default: 5000)

## Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio for database browsing