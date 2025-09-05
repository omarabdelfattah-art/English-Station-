
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.log('\n🔧 Troubleshooting Tips:');
  console.log('1. Create a .env file in the backend directory');
  console.log('2. Add your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the .env file');
  console.log('3. Make sure the .env file is in the correct location');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the database connection
async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // First, check if we can connect to Supabase at all
    const { data, error } = await supabase.from('pg_catalog.pg_tables').select('tablename').limit(1);
    
    if (error) {
      // Handle specific connection errors
      if (error.message.includes('ECONNREFUSED') || error.message.includes('connect ECONNREFUSED')) {
        throw new Error(`Database connection refused. Please ensure:\n1. Supabase service is running\n2. SUPABASE_URL is correct in your .env file\n3. Your network allows connections to the database`);
      }
      throw error;
    }
    
    // Then check if our specific tables exist
    const { error: tableError } = await supabase.from('lessons').select('count', { count: 'exact', head: true });

    if (tableError) {
      console.warn('⚠️  Connected to Supabase, but lessons table not found. You may need to run the table creation script.');
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Troubleshooting Tips:');
      console.log('1. Check if your Supabase project is active and accessible');
      console.log('2. Verify your SUPABASE_URL in .env file');
      console.log('3. Check your internet connection');
      console.log('4. Try accessing your Supabase dashboard directly');
    }
    
    process.exit(1);
  }
}

module.exports = { supabase, testConnection };
