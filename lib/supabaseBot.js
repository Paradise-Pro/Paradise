const { createClient } = require("@supabase/supabase-js");

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

module.exports = { getSupabase };

/*
const { getSupabase } = require('../lib/supabaseBot');
const supabase = getSupabase();
*/
