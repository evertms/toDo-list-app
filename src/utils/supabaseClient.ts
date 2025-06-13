import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
class SupabaseSingleton {
  private static instance: any;

  public static getInstance() {
    if (!SupabaseSingleton.instance) {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Faltan variables de entorno de Supabase');
      }

      SupabaseSingleton.instance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    return SupabaseSingleton.instance;
  }
}

export const supabase = SupabaseSingleton.getInstance();