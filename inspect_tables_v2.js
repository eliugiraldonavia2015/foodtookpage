
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nklckrihproujahogtpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbGNrcmlocHJvdWphaG9ndHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTEwNDQsImV4cCI6MjA4ODQ4NzA0NH0.ImupGmfeTQ25FJJaT0QEFb_KH8cQS4mIaFPBk-7LZSk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const tables = ['restaurant', 'category', 'users', 'user', 'zones', 'banners'];
  for (const table of tables) {
    console.log(`--- Checking ${table} ---`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) console.log(`Error: ${error.message}`);
    else console.log(`Found! Keys: ${Object.keys(data[0] || {})}`);
  }
}

inspect();
