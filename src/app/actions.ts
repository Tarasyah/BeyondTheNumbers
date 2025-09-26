// src/app/actions.ts
'use server'; // This directive is crucial!

import { createClient } from '@/utils/supabase/server';

// Action to get the main overview stats
export async function getOverviewStats() {
    const supabase = createClient();

    // Perform all queries in parallel for better performance
    const [
        mainGazaStatsRes,
        secondaryGazaStatsRes,
        wbStatsRes,
        famineStatsRes,
    ] = await Promise.all([
        // Query 1: Get the absolute latest row for the main stats
        supabase
            .from('gaza_daily_casualties')
            .select('killed_cum, injured_cum')
            .order('date', { ascending: false })
            .limit(1),
        // Query 2: Get the latest row that has valid data for children and women
        supabase
            .from('gaza_daily_casualties')
            .select('killed_children_cum, killed_women_cum')
            .not('killed_children_cum', 'is', null)
            .not('killed_women_cum', 'is', null)
            .order('date', { ascending: false })
            .limit(1),
        // Query 3: Get the latest West Bank stats
        supabase
            .from('west_bank_daily_casualties')
            .select('killed_cum')
            .order('date', { ascending: false })
            .limit(1),
        // Query 4: Get the latest child famine stats
        supabase
            .from('gaza_daily_casualties')
            .select('child_famine_cum')
            .not('child_famine_cum', 'is', null)
            .order('date', { ascending: false })
            .limit(1),
    ]);

    const { data: mainGazaData, error: mainGazaError } = mainGazaStatsRes;
    const { data: secondaryGazaData, error: secondaryGazaError } = secondaryGazaStatsRes;
    const { data: wbData, error: wbError } = wbStatsRes;
    const { data: famineData, error: famineError } = famineStatsRes;

    if (mainGazaError || secondaryGazaError || wbError || famineError) {
        console.error('Error fetching overview stats:', mainGazaError || secondaryGazaError || wbError || famineError);
        return null;
    }
    
    const latestMainGazaStats = mainGazaData?.[0];
    const latestSecondaryGazaStats = secondaryGazaData?.[0];
    const latestWbStats = wbData?.[0];
    const latestFamineStats = famineData?.[0];

    // Combine the results from the two Gaza queries
    return {
        totalKilled: latestMainGazaStats?.killed_cum ?? 0,
        totalInjured: latestMainGazaStats?.injured_cum ?? 0,
        childrenKilled: latestSecondaryGazaStats?.killed_children_cum ?? 0,
        womenKilled: latestSecondaryGazaStats?.killed_women_cum ?? 0,
        killedInWestBank: latestWbStats?.killed_cum ?? 0,
        childFamine: latestFamineStats?.child_famine_cum ?? 0,
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
