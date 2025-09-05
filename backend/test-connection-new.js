const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Simple query to test connection
    const { error } = await supabase
      .from('lessons')
      .select('count', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
