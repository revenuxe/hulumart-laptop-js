import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { supabaseUrl, supabasePublicKey } from './config';


export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabasePublicKey);
}
