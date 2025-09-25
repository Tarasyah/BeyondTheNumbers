
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owhwsvfxrqhjnllhspoh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93aHdzdmZ4cnFoam5sbGhzcG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg5OTksImV4cCI6MjA3NDM0NDk5OX0.DBPuCnSHBHBPm8oIB9oI-CFBGB0qObchzM3X04Q75so'

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey)
}
