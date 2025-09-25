import { createClient } from '@/lib/supabase';
import type { Summary, GazaDailyCasualties, WestBankDailyCasualties, DailyCasualties, InfrastructureDamaged, Martyr } from "@/lib/types";

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
  const westBankData = westBankLatest.data || { extra_data: {} };
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


async function getGazaDailyCasualties(): Promise<GazaDailyCasualties[]> {
  const { data, error } = await supabase
    .from('gaza_daily_casualties')
    .select('date, killed_cum, injured_cum, killed, injured')
    .order('date', { ascending: true });

  if (error) {
    console.error("Error fetching Gaza daily casualties:", error);
    return [];
  }
  return data.map(d => ({
    date: d.date,
    cumulative_killed: d.killed_cum,
    cumulative_injured: d.injured_cum,
    killed_today: d.killed,
    injured_today: d.injured
  }));
}

async function getWestBankDailyCasualties(): Promise<WestBankDailyCasualties[]> {
    const { data, error } = await supabase
      .from('west_bank_daily_casualties')
      .select('date, killed_cum, injured_cum')
      .order('date', { ascending: true });
  
    if (error) {
      console.error("Error fetching West Bank daily casualties:", error);
      return [];
    }
    return data.map(d => ({
        date: d.date,
        killed_cum: d.killed_cum,
        injured_cum: d.injured_cum
    }));
  }

export async function getDailyCasualties(): Promise<DailyCasualties[]> {
    const [gazaData, westBankData] = await Promise.all([
        getGazaDailyCasualties(),
        getWestBankDailyCasualties()
    ]);

    const combinedData: { [key: string]: DailyCasualties } = {};

    gazaData.forEach(d => {
        if(d.date) {
            combinedData[d.date] = {
                date: d.date,
                cumulative_killed: d.cumulative_killed || 0,
                cumulative_injured: d.cumulative_injured || 0,
                killed_today: d.killed_today || 0,
                injured_today: d.injured_today || 0,
            };
        }
    });

    westBankData.forEach(d => {
        if(d.date) {
            if (combinedData[d.date]) {
                combinedData[d.date].cumulative_killed += d.killed_cum || 0;
                combinedData[d.date].cumulative_injured += d.injured_cum || 0;
            } else {
                combinedData[d.date] = {
                    date: d.date,
                    cumulative_killed: d.killed_cum || 0,
                    cumulative_injured: d.injured_cum || 0,
                    killed_today: 0, // West bank data does not have daily breakdown
                    injured_today: 0,
                };
            }
        }
    });
    
    return Object.values(combinedData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      { type: 'Housing Units', destroyed: latest.residential_units || 0, damaged: 0, notes: 'total', last_update: latest.date },
      { type: 'Hospitals', destroyed: latest.extra_data?.hospitals?.total || 0, damaged: latest.extra_data?.hospitals?.damaged || 0, notes: 'total', last_update: latest.date },
      { type: 'Schools', destroyed: latest.educational_buildings || 0, damaged: 0, notes: 'Destroyed', last_update: latest.date },
      { type: 'Mosques', destroyed: latest.mosques || 0, damaged: 0, notes: 'destroyed', last_update: latest.date },
      { type: 'Churches', destroyed: latest.churches || 0, damaged: 0, notes: 'destroyed', last_update: latest.date }
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

export async function getMedicalKilled() {
    const { data, error } = await supabase.from('medical_killed').select('name');
    if (error) {
        console.error('Error fetching medical killed:', error);
        return [];
    }
    return data;
}
