// src/app/actions.ts
'use server'; // This directive is crucial!

import { createClient } from '@/utils/supabase/server';

// Action to get the main overview stats
export async function getOverviewStats() {
    const supabase = createClient();

    // Fetch latest Gaza stats
    const { data: gazaData, error: gazaError } = await supabase
        .from('gaza_daily_casualties')
        .select('killed_cum, injured_cum, killed_children_cum, killed_women_cum')
        .order('date', { ascending: false })
        .limit(1);
    
    // Fetch latest West Bank stats
    const { data: wbData, error: wbError } = await supabase
        .from('west_bank_daily_casualties')
        .select('killed_cum')
        .order('date', { ascending: false })
        .limit(1);

    if (gazaError || wbError) {
        console.error('Error fetching overview stats:', gazaError || wbError);
        return null;
    }
    
    const latestGazaStats = gazaData?.[0];
    const latestWbStats = wbData?.[0];

    return {
        totalKilled: latestGazaStats?.killed_cum ?? 0,
        totalInjured: latestGazaStats?.injured_cum ?? 0,
        childrenKilled: latestGazaStats?.killed_children_cum ?? 0,
        womenKilled: latestGazaStats?.killed_women_cum ?? 0,
        killedInWestBank: latestWbStats?.killed_cum ?? 0,
    };
}

// Action to get data for the cumulative timeline chart
export async function getCumulativeCasualties() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('gaza_daily_casualties')
        .select('date, killed_cum')
        .not('killed_cum', 'is', null)
        .order('date', { ascending: true }); // Ascending for timeline

    if (error) {
        console.error('Error fetching cumulative casualties:', error);
        return [];
    }
    return data;
}

// Action to get age distribution data
export async function getAgeDistribution() {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_age_distribution')

    if (error) {
        console.error('Error fetching age distribution:', error);
        return [];
    }
    return data;
}
