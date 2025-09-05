const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Creating database tables...');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL using Supabase's RPC function
    const { error } = await supabase.rpc('exec_sql', { sql: sql });

    if (error) {
      throw error;
    }

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createTables();
