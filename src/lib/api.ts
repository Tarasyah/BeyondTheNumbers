
import { createClient } from '@/lib/supabase';
import type { Summary, GazaDailyCasualties, InfrastructureDamaged, Martyr } from "@/lib/types";

const supabase = createClient();

export async function getSummary(): Promise<Summary> {
  const [gazaLatest, westBankLatest] = await Promise.all([
    supabase
      .from('gaza_daily_casualties')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('west_bank_daily_casualties')
      .select('*')
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

  return {
    gaza: {
      latest_update_date: gazaData.date,
      killed: {
        total: gazaData.cumulative_killed || 0,
        children: gazaData.killed_children_cum || 0,
        women: gazaData.killed_women_cum || 0,
        press: 0, // This info is not in the daily table
        medical: 0, // This info is not in the daily table
      },
      injured: {
        total: gazaData.cumulative_injured || 0,
      },
      detained: 0, // This is a West Bank stat
    },
    west_bank: {
      latest_update_date: westBankData.date,
      killed: westBankData.cumulative_killed || 0,
      injured: westBankData.cumulative_injured || 0,
      detained: westBankData.cumulative_detained || 0,
      settler_attacks: westBankData.cumulative_settler_attacks || 0,
    },
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
