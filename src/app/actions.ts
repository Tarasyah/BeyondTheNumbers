// src/app/actions.ts
'use server'; // This directive is crucial!

import { createClient } from '@/utils/supabase/server';

// Action to get the main overview stats
export async function getOverviewStats() {
    const supabase = createClient();

    // Fetch latest Gaza stats
    const { data: gazaPrimaryData, error: gazaPrimaryError } = await supabase
        .from('gaza_daily_casualties')
        .select('killed_cum, injured_cum')
        .order('date', { ascending: false })
        .limit(1)
        .single();
    
    // Fetch latest Gaza stats for children and women
    const { data: gazaSecondaryData, error: gazaSecondaryError } = await supabase
        .from('gaza_daily_casualties')
        .select('killed_children_cum, killed_women_cum')
        .not('killed_children_cum', 'is', null)
        .not('killed_women_cum', 'is', null)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    // Fetch latest West Bank stats
    const { data: wbData, error: wbError } = await supabase
        .from('west_bank_daily_casualties')
        .select('killed_cum')
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (gazaPrimaryError || gazaSecondaryError || wbError) {
        console.error('Error fetching overview stats:', gazaPrimaryError || gazaSecondaryError || wbError);
        return null;
    }
    
    // Combine gaza data
    const gazaData = {
        ...gazaPrimaryData,
        ...gazaSecondaryData
    }

    return {
        totalKilled: gazaData.killed_cum,
        totalInjured: gazaData.injured_cum,
        childrenKilled: gazaData.killed_children_cum,
        womenKilled: gazaData.killed_women_cum,
        killedInWestBank: wbData.killed_cum,
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