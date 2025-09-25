
import { createClient } from '@/lib/supabase';
import type { Summary, GazaDailyCasualties, InfrastructureDamaged, Martyr, WestBankDailyCasualties } from "@/lib/types";

const supabase = createClient();

export async function getSummary(): Promise<Summary> {
  const [gazaLatest, westBankLatest, pressKilledData, medicalKilledData] = await Promise.all([
    supabase
      .from('gaza_daily_casualties')
      .select('date, killed_cum, injured_cum, killed_children_cum, killed_women_cum')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('west_bank_daily_casualties')
      .select('date, detained_cum')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase.from('press_killed').select('name_en'),
    supabase.from('medical_killed').select('name')
  ]);

  if (gazaLatest.error) {
    console.error("Error fetching latest Gaza data:", gazaLatest.error);
  }
  if (westBankLatest.error) {
    console.error("Error fetching latest West Bank data:", westBankLatest.error);
  }
  
  const gazaData = gazaLatest.data || {};
  const westBankData = westBankLatest.data || {};

  const press_killed = pressKilledData.data?.length || 0;
  const medical_killed = medicalKilledData.data?.length || 0;

  const totalKilled = gazaData.killed_cum || 0;
  const womenKilled = gazaData.killed_women_cum || 0;
  const childrenKilled = gazaData.killed_children_cum || 0;
  
  return {
    latest_update_date: gazaData.date,
    killed: {
      total: totalKilled,
      children: childrenKilled,
      women: womenKilled,
      press: press_killed,
      medical: medical_killed,
    },
    injured: {
      total: gazaData.injured_cum || 0,
    },
    detained: westBankData.detained_cum || 0,
    killed_genders: {
      male: totalKilled - womenKilled - childrenKilled,
      female: womenKilled,
    },
    killed_age_groups: {
        child: childrenKilled,
    }
  };
}


export async function getGazaDailyCasualties(): Promise<GazaDailyCasualties[]> {
  const { data, error } = await supabase
    .from('gaza_daily_casualties')
    .select('date, killed_cum, injured_cum, killed_today, injured_today')
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
    killed_today: d.killed_today,
    injured_today: d.injured_today
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
