
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
      .select('extra_data')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase.from('press_killed').select('name_en', { count: 'exact', head: true }),
    supabase.from('medical_killed').select('name', { count: 'exact', head: true })
  ]);

  if (gazaLatest.error) {
    console.error("Error fetching latest Gaza data:", gazaLatest.error);
  }
  if (westBankLatest.error) {
    console.error("Error fetching latest West Bank data:", westBankLatest.error);
  }
  
  const gazaData = gazaLatest.data || {};
  const westBankData = westBankLatest.data || {};
  const detained = westBankData.extra_data?.detained_cum || 0;

  const press_killed = pressKilledData.count || 0;
  const medical_killed = medicalKilledData.count || 0;

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
    detained: detained,
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
    .select('date, killed_cum, injured_cum, killed, injured')
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
    killed_today: d.killed,
    injured_today: d.injured
  }));
}

export async function getInfrastructureDamaged(): Promise<InfrastructureDamaged[]> {
  const { data, error } = await supabase
    .from('infrastructure_damaged')
    .select('*')
    .order('date', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error("Error fetching infrastructure data:", error);
    return [];
  }
  
  const latest = data?.[0] || {};
  
  return [
      { type: 'Housing Units', quantity: latest.residential_units || 0, notes: 'total', last_update: latest.date },
      { type: 'Hospitals', quantity: latest.extra_data?.hospitals?.total || 0, notes: 'total', last_update: latest.date },
      { type: 'Hospitals', quantity: latest.extra_data?.hospitals?.damaged || 0, notes: 'damaged', last_update: latest.date },
      { type: 'Educational facilities', quantity: latest.educational_buildings || 0, notes: 'Destroyed', last_update: latest.date },
      { type: 'Mosques', quantity: latest.mosques || 0, notes: 'destroyed', last_update: latest.date },
      { type: 'Churches', quantity: latest.churches || 0, notes: 'destroyed', last_update: latest.date }
  ];
}

export async function getMartyrs(): Promise<Martyr[]> {
    const { data, error } = await supabase
        .from('martyrs')
        .select('en_name, id, dob, sex, age');

    if (error) {
        console.error("Error fetching martyrs:", error);
        return [];
    }
    return data as Martyr[];
}

// Added function to fetch medical personnel killed
export async function getMedicalKilled() {
    const { data, error } = await supabase.from('medical_killed').select('name');
    if (error) {
        console.error('Error fetching medical killed:', error);
        return [];
    }
    return data;
}
