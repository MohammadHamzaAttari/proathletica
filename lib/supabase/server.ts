import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let cachedServiceClient: ReturnType<typeof createSupabaseClient> | null = null;
let warnedReadClient = false;
let warnedServiceClient = false;

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseAnonKey() {
  // Support both key names for compatibility
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function warnMissingSupabase(scope: 'read' | 'service') {
  if (scope === 'read') {
    if (warnedReadClient) return;
    warnedReadClient = true;
    console.warn(
      '[ProAthletica] Supabase read client not configured. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live content.'
    );
    return;
  }
  if (warnedServiceClient) return;
  warnedServiceClient = true;
  console.warn(
    '[ProAthletica] Supabase service client not configured. ' +
    'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable writes and tracking.'
  );
}

export function hasSupabaseConfig() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function createServiceClient() {
  if (cachedServiceClient) return cachedServiceClient;
  const url = getSupabaseUrl();
  const key = getSupabaseServiceKey();
  if (!url || !key) {
    warnMissingSupabase('service');
    return null;
  }
  cachedServiceClient = createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedServiceClient;
}

export function createReadClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url) {
    warnMissingSupabase('read');
    return null;
  }

  if (key) {
    return createSupabaseClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  const serviceKey = getSupabaseServiceKey();
  if (serviceKey) {
    console.warn(
      '[ProAthletica] Supabase anon key is missing. Falling back to the service role key for server-side reads.'
    );
    return createSupabaseClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  warnMissingSupabase('read');
  return null;
}
