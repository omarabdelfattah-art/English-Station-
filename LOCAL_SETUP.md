# Local Development Setup

This guide will help you set up the English Learning App for local development with PostgreSQL or Supabase.

## Prerequisites

1. Node.js (v14 or higher)

## Option 1: Using Supabase (Recommended - Easiest Setup)

### 1. Create Supabase Account

1. Go to https://supabase.com and sign up for a free account
2. Create a new project in your Supabase dashboard
3. Note your project's:
   - Project ID
   - Database password
   - API keys

### 2. Update Environment Variables

Update the `backend/.env` file with your Supabase credentials:

```env
DATABASE_URL="postgresql://postgres:[YOUR_PROJECT_ID]:5432/postgres?schema=public"
SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
SUPABASE_KEY="YOUR_ANON_KEY"
PORT=5000
```

### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 5. Seed the Database (Optional)

```bash
cd backend
npm run prisma:seed
cd ..
```

### 6. Start the Application

You need to run both the React app and the backend API server simultaneously:

**Terminal 1 - Start the backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start the React app:**
```bash
npm start
```

## Option 2: Using Local PostgreSQL Installation

### 1. Install PostgreSQL

Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database

Create a new database for the application:

```sql
CREATE DATABASE english_learning_app;
```

### 3. Update Environment Variables

Update the `backend/.env` file with your database credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/english_learning_app?schema=public"
PORT=5000
```

### 4. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 5. Run Database Migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

### 6. Seed the Database (Optional)

```bash
cd backend
npm run prisma:seed
cd ..
```

### 7. Start the Application

You need to run both the React app and the backend API server simultaneously:

**Terminal 1 - Start the backend API:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Start the React app:**
```bash
npm start
```

## Option 3: Using Docker (Alternative)

### 1. Install Docker

Download and install Docker from https://www.docker.com/products/docker-desktop

### 2. Start Services

Run the following command to start PostgreSQL, the backend API, and other services:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 5000

### 3. Run Database Migrations

```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma generate
```

### 4. Seed the Database (Optional)

```bash
docker-compose exec backend npm run prisma:seed
```

### 5. Start the React App

In a separate terminal, start the React frontend:

```bash
npm start
```

## Database Management

### Prisma Studio

You can use Prisma Studio to browse and manage your database:

```bash
cd backend
npx prisma studio
```

Or with Docker:

```bash
docker-compose exec backend npx prisma studio
```

### Database Schema Updates

When you make changes to the Prisma schema:

1. Update `backend/prisma/schema.prisma`
2. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev --name migration_name
   ```
3. Regenerate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the database:

1. Verify your database service is running
2. Check your DATABASE_URL in the `.env` file
3. Ensure your database user has the necessary permissions

### Reset Database

To reset the database:

```bash
cd backend
npx prisma migrate reset
```

Or with Docker:

```bash
docker-compose exec backend npx prisma migrate reset
```