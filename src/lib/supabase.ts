// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Log environment variables for comprehensive debugging
console.log('Environment Variable Check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');

// Explicitly check for environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Enhanced error handling function
function validateSupabaseConfig() {
  const errors: string[] = [];

  if (!supabaseUrl) {
    console.error('❌ Critical Error: NEXT_PUBLIC_SUPABASE_URL is missing');
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }

  if (!supabaseAnonKey) {
    console.error('❌ Critical Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }

  if (errors.length > 0) {
    const errorMessage = `Supabase Configuration Errors:\n${errors.map(e => `- ${e}`).join('\n')}

TROUBLESHOOTING STEPS:
1. Verify .env.local file exists in project root
2. Check that NEXT_PUBLIC_ prefix is used for client-side variables
3. Ensure no extra spaces in environment variable values
4. Restart development server and rebuild project
5. Verify Vercel environment variable configuration`;

    console.error(errorMessage);
    
    // In production, you might want to handle this more gracefully
    if (process.env.NODE_ENV === 'production') {
      // Log to a monitoring service or send an alert
      console.error('Supabase configuration error in production');
    } else {
      throw new Error(errorMessage);
    }
  }
}

// Validate configuration before creating client
validateSupabaseConfig();

// Create Supabase client with comprehensive configuration
export const supabase = createClient(
  supabaseUrl!, 
  supabaseAnonKey!, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: { 
        'x-application-name': 'TruckingWebsite',
        'x-environment': process.env.NODE_ENV || 'unknown'
      },
    },
  }
);

// Optional: Admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: { 
        'x-application-name': 'TruckingWebsite-Admin',
        'x-environment': process.env.NODE_ENV || 'unknown'
      },
    },
  }
);