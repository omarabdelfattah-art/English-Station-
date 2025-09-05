require('@supabase/supabase-js');
require('dotenv').config();
const https = require('https');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });

    const options = {
      hostname: new URL(supabaseUrl).hostname,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function createTables() {
  try {
    console.log('Creating database tables...');

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
      console.log('Users table created successfully!');
    } catch (error) {
      console.error('Error creating users table:', error.message);
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
      console.log('Lessons table created successfully!');
    } catch (error) {
      console.error('Error creating lessons table:', error.message);
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
      console.log('Vocabulary table created successfully!');
    } catch (error) {
      console.error('Error creating vocabulary table:', error.message);
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
      console.log('Progress table created successfully!');
    } catch (error) {
      console.error('Error creating progress table:', error.message);
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
      console.log('Quizzes table created successfully!');
    } catch (error) {
      console.error('Error creating quizzes table:', error.message);
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
      console.log('Questions table created successfully!');
    } catch (error) {
      console.error('Error creating questions table:', error.message);
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
      console.log('Answers table created successfully!');
    } catch (error) {
      console.error('Error creating answers table:', error.message);
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
      console.log('Quiz_results table created successfully!');
    } catch (error) {
      console.error('Error creating quiz_results table:', error.message);
    }

    console.log('Database tables creation process completed!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Run the function
createTables().then(() => {
  console.log('Script execution completed');
  process.exit(0);
}).catch(err => {
  console.error('Script execution failed:', err);
  process.exit(1);
});
