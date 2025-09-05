# Supabase Database Setup Guide

This guide explains how to create the necessary tables in your Supabase database for the English Learning Platform.

## Prerequisites

Before proceeding, ensure you have:
1. A Supabase account and project
2. Your Supabase URL and service role key configured in your .env file
3. Completed the migration from Prisma to Supabase

## Method 1: Using the Supabase Dashboard (Recommended)

This is the simplest method and gives you full control over the table creation process.

### Steps:

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to the "Table Editor" section in the left sidebar
4. Click "Create a new table" for each of the following tables:

#### Users Table
- Table name: `users`
- Columns:
  - `id` (text, primary key)
  - `email` (text, unique, not null)
  - `username` (text, unique, not null)
  - `password` (text, not null)
  - `refreshToken` (text, nullable)
  - `createdAt` (timestamp, default: now)
  - `updatedAt` (timestamp, default: now)

#### Lessons Table
- Table name: `lessons`
- Columns:
  - `id` (integer, primary key, auto-increment)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `content` (text, not null)
  - `level` (text, nullable)
  - `createdAt` (timestamp, default: now)
  - `updatedAt` (timestamp, default: now)

#### Vocabulary Table
- Table name: `vocabulary`
- Columns:
  - `id` (integer, primary key, auto-increment)
  - `word` (text, not null)
  - `meaning` (text, not null)
  - `example` (text, nullable)
  - `lessonId` (integer, foreign key to lessons.id, on delete: cascade)
  - `createdAt` (timestamp, default: now)

#### Progress Table
- Table name: `progress`
- Columns:
  - `id` (text, primary key)
  - `userId` (text, foreign key to users.id, on delete: cascade)
  - `lessonId` (integer, foreign key to lessons.id, on delete: cascade)
  - `completed` (boolean, default: false)
  - `progress` (integer, default: 0)
  - `createdAt` (timestamp, default: now)
  - `updatedAt` (timestamp, default: now)
- Add a unique constraint on (userId, lessonId)

#### Quizzes Table
- Table name: `quizzes`
- Columns:
  - `id` (integer, primary key, auto-increment)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `lessonId` (integer, foreign key to lessons.id, on delete: cascade)
  - `timeLimit` (integer, nullable)
  - `createdAt` (timestamp, default: now)

#### Questions Table
- Table name: `questions`
- Columns:
  - `id` (integer, primary key, auto-increment)
  - `content` (text, not null)
  - `quizId` (integer, foreign key to quizzes.id, on delete: cascade)
  - `type` (text, not null)
  - `createdAt` (timestamp, default: now)

#### Answers Table
- Table name: `answers`
- Columns:
  - `id` (integer, primary key, auto-increment)
  - `content` (text, not null)
  - `isCorrect` (boolean, not null)
  - `questionId` (integer, foreign key to questions.id, on delete: cascade)
  - `createdAt` (timestamp, default: now)

#### Quiz Results Table
- Table name: `quiz_results`
- Columns:
  - `id` (text, primary key)
  - `userId` (text, foreign key to users.id, on delete: cascade)
  - `quizId` (integer, foreign key to quizzes.id, on delete: cascade)
  - `score` (integer, not null)
  - `answers` (text, not null) - This will store JSON data
  - `createdAt` (timestamp, default: now)

## Method 2: Using the SQL Editor

If you prefer to use SQL directly:

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to the "SQL Editor" section in the left sidebar
4. Click "New query"
5. Copy the contents of the `create-tables.sql` file into the editor
6. Click "Run"

## Method 3: Using the create-tables.js Script

You can also use the provided JavaScript script to create the tables:

1. Make sure your .env file is properly configured with your Supabase credentials
2. Run the script:
   ```
   node create-tables.js
   ```

Note: This method requires that you have a custom RPC function called `exec_sql` in your Supabase database. If you don't have this function, you'll need to create it first using the SQL Editor:

```sql
create or replace function exec_sql(sql text)
returns void
language plpgsql
as $$
begin
  execute sql;
end;
$$;
```

## Seeding Initial Data

After creating the tables, you may want to seed them with initial data:

1. Run the seed script:
   ```
   node prisma/seed.js
   ```

This will create initial lessons and settings in your database.

## Verifying the Tables

After creating the tables, verify that they were created correctly:

1. Go to the "Table Editor" in the Supabase Dashboard
2. Check that all the tables are listed
3. Click on each table to verify the columns and relationships

## Troubleshooting

If you encounter any issues:

1. Check that your Supabase URL and service role key are correct in your .env file
2. Ensure you have the necessary permissions to create tables in your Supabase project
3. Review the error messages for specific details about what went wrong

## Next Steps

After creating the tables, you can:

1. Start your backend server
2. Test the API endpoints
3. Deploy your application to a server

Your database is now ready to be used with your English Learning Platform backend!
