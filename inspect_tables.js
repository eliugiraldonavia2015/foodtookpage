
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nklckrihproujahogtpg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbGNrcmlocHJvdWphaG9ndHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MTEwNDQsImV4cCI6MjA4ODQ4NzA0NH0.ImupGmfeTQ25FJJaT0QEFb_KH8cQS4mIaFPBk-7LZSk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  console.log('--- Restaurants ---');
  const { data: restaurants, error: rError } = await supabase.from('restaurants').select('*').limit(1);
  if (rError) console.error(rError);
  else console.log(Object.keys(restaurants[0] || {}));

  console.log('--- Categories ---');
  const { data: categories, error: cError } = await supabase.from('categories').select('*').limit(1);
  if (cError) console.error(cError);
  else console.log(Object.keys(categories[0] || {}));
}

inspect();
