"use client";

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { supabaseUrl, supabasePublicKey } from './config';


export const supabase = createClient<Database>(supabaseUrl, supabasePublicKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
