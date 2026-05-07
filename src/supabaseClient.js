import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqypnahjvdxhwmuqxjra.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeXBuYWhqdmR4aHdtdXF4anJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDYwOTYsImV4cCI6MjA5MzY4MjA5Nn0.s55L3oRd7qgoLX5C__arIaOHyDMagvTIYVTcExo4VJ8';

export const supabase = createClient(supabaseUrl, supabaseKey);
