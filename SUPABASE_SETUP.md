# Supabase Setup Guide

This guide will help you set up Supabase for the English Learning App.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- PostgreSQL database
- Authentication
- Automatic APIs
- Real-time subscriptions
- Storage
- Dashboard for data management

## Getting Started with Supabase

### 1. Using Your Existing Project

We can see you've already created a Supabase project with the URL:
`https://zaxzeakqxiwzzrwrzekm.supabase.co`

To complete the setup:

1. Go to your Supabase dashboard at https://zaxzeakqxiwzzrwrzekm.supabase.co
2. In the left sidebar, click on "Settings" (gear icon)
3. Click on "Database"
4. Find your database password in the "Connection Info" section
5. Update the `backend/.env` file with your database password:

```env
# Database Configuration - Supabase
DATABASE_URL="postgresql://postgres.zaxzeakqxiwzzrwrzekm:YOUR_DATABASE_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public"

# Supabase Configuration
SUPABASE_URL="https://zaxzeakqxiwzzrwrzekm.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheHplYWtxeGl3enpyd3J6ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDg0MjQsImV4cCI6MjA3MTk4NDQyNH0.V0TnWVXxONeroTQx5tvYv1psf6rvUvtKaX1kBO1Upck"

# Server Configuration
PORT=5000
```

Replace `YOUR_DATABASE_PASSWORD` with the actual password from your Supabase dashboard.

### 2. Install Dependencies and Run Migrations

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

### 3. Start the Frontend

In a new terminal:
```bash
npm start
```

## Using Supabase Authentication (Optional)

If you want to use Supabase's built-in authentication:

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Configure your auth settings as needed
3. You can use the Supabase JavaScript client in your frontend:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zaxzeakqxiwzzrwrzekm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheHplYWtxeGl3enpyd3J6ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDg0MjQsImV4cCI6MjA3MTk4NDQyNH0.V0TnWVXxONeroTQx5tvYv1psf6rvUvtKaX1kBO1Upck'
)
```

## Troubleshooting

### Connection Issues

If you're having trouble connecting to your Supabase database:

1. Double-check your DATABASE_URL
2. Ensure you're using the correct database password
3. Make sure your Supabase project is fully provisioned
4. Check that you've enabled connection pooling if using the connection string we provided

### Prisma Migrations

If you encounter issues with Prisma migrations:

1. Make sure you've updated the DATABASE_URL in your `.env` file
2. Ensure you can connect to the database using a database client
3. Try running `npx prisma migrate dev --name init --skip-generate` first, then `npx prisma generate`

## Benefits of Using Supabase

1. **No Local Installation**: No need to install PostgreSQL locally
2. **Easy Setup**: Get started quickly with a cloud database
3. **Built-in Auth**: Authentication without additional setup
4. **Automatic APIs**: REST and GraphQL APIs generated automatically
5. **Dashboard**: Web-based interface for managing your data
6. **Real-time**: Built-in real-time subscriptions
7. **Free Tier**: Generous free tier for development and small projects

## Next Steps

Once you have your application running with Supabase:

1. Explore the Supabase dashboard to manage your data
2. Check out the Supabase documentation for advanced features
3. Consider implementing Supabase authentication in your app
4. Look into Supabase's real-time features for live updates