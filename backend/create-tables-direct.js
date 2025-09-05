require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL(sql) {
  try {
    // First, check if the connection works
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .limit(1);
      
    if (error) {
      // Handle specific connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect ECONNREFUSED')) {
        throw new Error(`Database connection refused. Please ensure:\n1. Supabase service is running\n2. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct in your .env file\n3. Your network allows connections to the database`);
      }
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log(`Executing SQL: ${sql.substring(0, 50)}...`);
    
    // Use the Supabase SQL API through the postgres meta table
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: sql
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SQL execution failed: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error executing SQL: ${error.message}`);
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Creating database tables...');
    let successCount = 0;
    let errorCount = 0;

    // Create users table
    console.log('Creating users table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          refreshToken TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating users table:', error.message);
      errorCount++;
    }

    // Create lessons table
    console.log('Creating lessons table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS lessons (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          level TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Lessons table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating lessons table:', error.message);
      errorCount++;
    }

    // Create vocabulary table
    console.log('Creating vocabulary table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS vocabulary (
          id SERIAL PRIMARY KEY,
          word TEXT NOT NULL,
          meaning TEXT NOT NULL,
          example TEXT,
          lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Vocabulary table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating vocabulary table:', error.message);
      errorCount++;
    }

    // Create progress table
    console.log('Creating progress table...');
    try {
      await executeSQL(`
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
      `);
      console.log('✅ Progress table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating progress table:', error.message);
      errorCount++;
    }

    // Create quizzes table
    console.log('Creating quizzes table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS quizzes (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
          timeLimit INTEGER,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Quizzes table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating quizzes table:', error.message);
      errorCount++;
    }

    // Create questions table
    console.log('Creating questions table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS questions (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Questions table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating questions table:', error.message);
      errorCount++;
    }

    // Create answers table
    console.log('Creating answers table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS answers (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          isCorrect BOOLEAN NOT NULL,
          questionId INTEGER REFERENCES questions(id) ON DELETE CASCADE,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Answers table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating answers table:', error.message);
      errorCount++;
    }

    // Create quiz_results table
    console.log('Creating quiz_results table...');
    try {
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id TEXT PRIMARY KEY,
          userId TEXT REFERENCES users(id) ON DELETE CASCADE,
          quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
          score INTEGER NOT NULL,
          answers TEXT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Quiz_results table created successfully!');
      successCount++;
    } catch (error) {
      console.error('❌ Error creating quiz_results table:', error.message);
      errorCount++;
    }

    // Summary
    console.log('\n=== Database Tables Creation Summary ===');
    console.log(`✅ Successfully created: ${successCount} tables`);
    console.log(`❌ Failed to create: ${errorCount} tables`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some tables could not be created. Please check the error messages above.');
    } else {
      console.log('\n🎉 All database tables were created successfully!');
    }
  } catch (error) {
    console.error('\n🚨 Critical error during table creation process:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Check if your Supabase project is active and accessible');
      console.log('2. Verify your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
      console.log('3. Check your internet connection');
      console.log('4. Try accessing your Supabase dashboard directly');
    }
git add .
  }
}

createTables();
