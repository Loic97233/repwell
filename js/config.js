/* =====================================================
   REPWELL — Configuration Supabase
   ===================================================== */

const SUPABASE_URL  = 'https://kqsglnpxwcpqiiaivtna.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxc2dsbnB4d2NwcWlpYWl2dG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTIzNjgsImV4cCI6MjA5MTM4ODM2OH0.imqsSg6V9DCX7vuxjsjGm0VbH-OAKhGxcwNAynE_y90';

// Le CDN Supabase v2 expose window.supabase comme module avec createClient
// var (pas const) pour que window.supabase soit le client, pas le module CDN
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
