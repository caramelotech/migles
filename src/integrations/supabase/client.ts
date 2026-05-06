import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function createSupabaseClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!SUPABASE_ANON_KEY ? ["SUPABASE_ANON_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

function getSupabase() {
  if (!_supabase) _supabase = createSupabaseClient();
  return _supabase;
}

export const supabase = {
  get auth() {
    return getSupabase().auth;
  },
  get from() {
    return getSupabase().from.bind(getSupabase());
  },
  get rpc() {
    return getSupabase().rpc.bind(getSupabase());
  },
  get storage() {
    return getSupabase().storage;
  },
  get realtime() {
    return getSupabase().realtime;
  },
  get functions() {
    return getSupabase().functions;
  },
  removeAuthListener: (subscription: { unsubscribe?: () => void }) => subscription?.unsubscribe?.(),
};
