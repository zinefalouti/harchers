// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve the Supabase URL and Anon Key from the environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
