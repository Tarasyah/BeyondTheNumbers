
import { createClient } from '@/lib/supabase';
import type { Summary, GazaDailyCasualties, InfrastructureDamaged, Martyr } from "@/lib/types";

const supabase = createClient();

export async function getSummary(): Promise<Summary> {
  const [gazaSummary, westBankSummary] = await Promise.all([
    supabase
      .from('gaza_summary')
      .select('*')
      .order('latest_update_date', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('west_bank_summary')
      .select('*')
      .order('latest_update_date', { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (gazaSummary.error) {
    console.error("Error fetching Gaza summary:", gazaSummary.error);
  }
  if (westBankSummary.error) {
    console.error("Error fetching West Bank summary:", westBankSummary.error);
  }

  return {
    gaza: gazaSummary.data || {},
    west_bank: westBankSummary.data || {},
  } as Summary;
}

export async function getGazaDailyCasualties(): Promise<GazaDailyCasualties[]> {
  const { data, error } = await supabase
    .from('gaza_daily_casualties')
    .select('date, cumulative_killed, cumulative_injured')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching daily casualties:", error);
    return [];
  }
  return data as GazaDailyCasualties[];
}

export async function getInfrastructureDamaged(): Promise<InfrastructureDamaged[]> {
  const { data, error } = await supabase
    .from('infrastructure_damaged')
    .select('*')
    .order('last_update', { ascending: false });
    
  if (error) {
    console.error("Error fetching infrastructure data:", error);
    return [];
  }
  return data as InfrastructureDamaged[];
}

export async function getMartyrs(): Promise<Martyr[]> {
    const { data, error } = await supabase
        .from('martyrs')
        .select('en_name, id, dob, sex, age')
        .limit(100);

    if (error) {
        console.error("Error fetching martyrs:", error);
        return [];
    }
    return data as Martyr[];
}
