
import { createClient } from '@/lib/supabase';
import type { Summary, GazaDailyCasualties, InfrastructureDamaged, Martyr, WestBankDailyCasualties } from "@/lib/types";

const supabase = createClient();

export async function getSummary(): Promise<Summary> {
  const [gazaLatest, westBankLatest] = await Promise.all([
    supabase
      .from('gaza_daily_casualties')
      .select('date, killed_cum, injured_cum, killed_children_cum, killed_women_cum')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('west_bank_daily_casualties')
      .select('date, killed_cum, injured_cum, detained_cum')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (gazaLatest.error) {
    console.error("Error fetching latest Gaza data:", gazaLatest.error);
  }
  if (westBankLatest.error) {
    console.error("Error fetching latest West Bank data:", westBankLatest.error);
  }
  
  const gazaData = gazaLatest.data || {};
  const westBankData = westBankLatest.data || {};

  // The press and medical killed stats are not in the daily tables.
  // This will require a separate query or a different data source in the future.
  const pressKilledData = { data: [], error: null }; // Placeholder
  const medicalKilledData = { data: [], error: null }; // Placeholder

  const press_killed = pressKilledData.data?.length || 0;
  const medical_killed = medicalKilledData.data?.length || 0;

  return {
    latest_update_date: gazaData.date,
    killed: {
      total: gazaData.killed_cum || 0,
      children: gazaData.killed_children_cum || 0,
      women: gazaData.killed_women_cum || 0,
      press: press_killed,
      medical: medical_killed,
    },
    injured: {
      total: gazaData.injured_cum || 0,
    },
    detained: westBankData.detained_cum || 0,
    killed_genders: {
      male: (gazaData.killed_cum || 0) - (gazaData.killed_women_cum || 0),
      female: gazaData.killed_women_cum || 0,
    },
    killed_age_groups: {
        child: gazaData.killed_children_cum || 0,
    }
  };
}


export async function getGazaDailyCasualties(): Promise<GazaDailyCasualties[]> {
  const { data, error } = await supabase
    .from('gaza_daily_casualties')
    .select('date, killed_cum, injured_cum')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching daily casualties:", error);
    return [];
  }
  // Remap to match original expected keys for the chart
  return data.map(d => ({
    date: d.date,
    cumulative_killed: d.killed_cum,
    cumulative_injured: d.injured_cum,
    killed_today: 0, // This data is not available in the new query
    injured_today: 0 // This data is not available in the new query
  }));
}

export async function getInfrastructureDamaged(): Promise<InfrastructureDamaged[]> {
  const { data, error } = await supabase
    .from('infrastructure_damaged')
    .select('*');
    
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
