import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase";

const SUPABASE_URL = "https://cinhozbbyrniovdlrjny.supabase.co";

const supabase = createClient<Database>(
  SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY || ""
);

export default supabase;
