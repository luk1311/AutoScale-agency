import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdojsvfekspzsmzroltm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb2pzdmZla3NwenNtenJvbHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjU2MTUsImV4cCI6MjA5NzU0MTYxNX0.XypeB-MmUPwK9Ub23OTDi4M0su387s1sGt01GQUnZjU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('leads').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
