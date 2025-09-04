/**
 * Supabase Service Module
 *
 * This module provides integration with Supabase for database operations,
 * authentication, and real-time features.
 *
 * Features:
 * - Supabase client configuration
 * - Authentication methods
 * - Database operations
 * - Real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 * @type {Object}
 * @property {string} supabaseUrl - Supabase project URL
 * @property {string} supabaseKey - Supabase anon/public key
 */
const supabaseConfig = {
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL || 'https://zxaqgjmlqdyrkafjyvsa.supabase.co',
  supabaseKey: process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YXFnam1scWR5cmthZmp5dnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTI0ODEsImV4cCI6MjA3MjUyODQ4MX0.KCdC7La3Fe_MQMuftpPYj0m-t_Ags0GBTv3PmTecanw'
};

/**
 * Supabase Client Instance
 * @type {SupabaseClient}
 */
const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

export default supabase;

// Export the configuration for other modules
export { supabaseConfig };
