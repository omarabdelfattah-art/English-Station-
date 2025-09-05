# Using the Supabase SQL Editor to Create Tables

This guide will help you create all the necessary tables in your Supabase database using the SQL Editor, which is much easier than manual table creation or running scripts.

## Step 1: Log in to Supabase

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in to your account
3. Select your project

## Step 2: Open the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click on "New query" to open a new SQL editor window

## Step 3: Copy and Paste the SQL

Copy the entire SQL code below and paste it into the SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refreshToken TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    level TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    example TEXT,
    lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    userId TEXT REFERENCES users(id) ON DELETE CASCADE,
    lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, lessonId)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    timeLimit INTEGER,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    questionId INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id TEXT PRIMARY KEY,
    userId TEXT REFERENCES users(id) ON DELETE CASCADE,
    quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    answers TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 4: Run the SQL

1. After pasting the SQL code into the editor, click the "Run" button
2. Wait for the execution to complete
3. You should see a success message indicating that all tables were created

## Step 5: Verify the Tables

1. Go to the "Table Editor" in the left sidebar
2. You should see all the tables listed:
   - users
   - lessons
   - vocabulary
   - progress
   - quizzes
   - questions
   - answers
   - quiz_results
3. Click on each table to verify the columns and relationships

## Step 6: Seed Initial Data

After creating the tables, you can seed them with initial data:

1. Open a new SQL query in the SQL Editor
2. Copy and paste the following SQL:

```sql
-- Insert initial lessons
INSERT INTO lessons (title, description, content, level) VALUES
('Introduction to English', 'Basic introduction to the English language', 'Welcome to your first English lesson! In this lesson, we''ll cover the basics of English grammar and vocabulary.', 'A1'),
('Basic Grammar', 'Learn fundamental English grammar rules', 'In this lesson, we''ll explore the basic building blocks of English grammar including nouns, verbs, and adjectives.', 'A1'),
('Common Vocabulary', 'Essential English words and phrases', 'Expand your vocabulary with these commonly used English words and phrases that will help you in everyday conversations.', 'A1'),
('Present Tense', 'Master the present simple and continuous tenses', 'Learn how to use the present simple and present continuous tenses correctly in various contexts.', 'A2'),
('Past Tense', 'Understanding past simple and past continuous', 'This lesson covers how to talk about past events using the past simple and past continuous tenses.', 'A2');

-- Insert initial settings
INSERT INTO settings (key, value) VALUES
('app_name', 'English Learning Platform'),
('app_version', '1.0.0'),
('max_lesson_length', '30'),
('default_language_level', 'A1');
```

3. Click "Run" to execute the SQL
4. You should see a success message indicating that the data was inserted

## Step 7: Test Your Application

Now that the tables are created and seeded with initial data, you can:

1. Start your backend server
2. Test the API endpoints
3. Verify that everything is working correctly

This approach using the SQL Editor is much easier than manual table creation or running scripts, and it ensures that all tables are created correctly with the proper relationships and constraints.
