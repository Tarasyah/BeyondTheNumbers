import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// Main function that runs when the Edge Function is called
Deno.serve(async (req)=>{
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  console.log('Daily data fetch process started.');
  try {
    await Promise.all([
      fetchAndSaveDailyData(supabase, 'gaza'),
      fetchAndSaveDailyData(supabase, 'west_bank'),
      fetchAndSaveInfrastructure(supabase),
      fetchAndSavePressKilled(supabase),
      fetchAllMartyrs(supabase)
    ]);
    console.log('All data fetched and saved successfully!');
    return new Response(JSON.stringify({
      message: 'All data updated successfully.'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('An error occurred during the data fetch process:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
// --- HELPER FUNCTIONS ---
async function fetchAndSaveDailyData(supabase, region) {
  const tableName = region === 'gaza' ? 'gaza_daily_casualties' : 'west_bank_daily_casualties';
  const url = region === 'gaza' ? 'https://data.techforpalestine.org/api/v2/casualties_daily.min.json' : 'https://data.techforpalestine.org/api/v2/west_bank_daily.min.json';
  console.log(`Fetching daily casualties for ${region}...`);
  const res = await fetch(url);
  const data = await res.json();
  const knownColumns = [
    'date',
    'killed',
    'injured',
    'killed_cum',
    'injured_cum',
    'aid_seeker_killed_cum',
    'aid_seeker_injured_cum',
    'killed_children_cum',
    'injured_children_cum',
    'killed_women_cum',
    'injured_women_cum',
    'flash_source',
    'child_famine_cum'
  ];
  const processedData = data.map((dayData)=>{
    const row = {};
    const extra_data = {};
    for(const key in dayData){
      if (knownColumns.includes(key)) {
        row[key] = dayData[key];
      } else {
        extra_data[key] = dayData[key];
      }
    }
    row['extra_data'] = extra_data;
    return row;
  });
  const { error } = await supabase.from(tableName).upsert(processedData, {
    onConflict: 'date'
  });
  if (error) throw new Error(`${region} Casualties Error: ${error.message}`);
  console.log(`-> Success: ${region} casualties saved.`);
}
async function fetchAndSaveInfrastructure(supabase) {
  console.log('Fetching infrastructure damage...');
  const res = await fetch('https://data.techforpalestine.org/api/v3/infrastructure-damaged.min.json');
  const data = await res.json();
  const knownColumns = [
    'date',
    'residential_units',
    'government_buildings',
    'educational_buildings',
    'mosques',
    'churches',
    'civic_buildings'
  ];
  const processedData = data.map((dayData)=>{
    const row = {};
    const extra_data = {};
    for(const key in dayData){
      const value = dayData[key];
      if (knownColumns.includes(key)) {
        if (typeof value === 'object' && value !== null) {
          extra_data[key] = value;
          if ('total' in value) {
            row[key] = value.total;
          } else {
            row[key] = null;
          }
        } else {
          row[key] = value;
        }
      } else {
        extra_data[key] = value;
      }
    }
    row['extra_data'] = extra_data;
    return row;
  });
  const { error } = await supabase.from('infrastructure_damaged').upsert(processedData, {
    onConflict: 'date'
  });
  if (error) throw new Error(`Infrastructure Error: ${error.message}`);
  console.log('-> Success: Infrastructure data saved.');
}
async function fetchAndSavePressKilled(supabase) {
  console.log('Fetching press killed data...');
  const res = await fetch('https://data.techforpalestine.org/api/v2/press_killed_in_gaza.min.json');
  const data = await res.json();
  const { error } = await supabase.from('press_killed').upsert(data, {
    onConflict: 'name_en'
  });
  if (error) throw new Error(`Press Killed Error: ${error.message}`);
  console.log('-> Success: Press killed data saved.');
}
// ### MODIFIED MARTYRS FUNCTION ###
async function fetchAllMartyrs(supabase) {
  console.log('Fetching all martyrs in batches...');
  let page = 1;
  let batch = [];
  const batchSize = 1000; // Process 1000 records at a time
  while(true){
    try {
      const res = await fetch(`https://data.techforpalestine.org/api/v2/killed-in-gaza/page-${page}.json`);
      if (!res.ok) {
        console.log(`Reached the last page of martyrs (page ${page}).`);
        break;
      }
      const data = await res.json();
      if (data.length === 0) {
        console.log(`Reached the last page with no data (page ${page}).`);
        break;
      }
      const cleanedData = data.map((m)=>({
          ...m,
          dob: m.dob === "" ? null : m.dob
        }));
      batch.push(...cleanedData);
      // If the batch is full, save it to the database
      if (batch.length >= batchSize) {
        console.log(`Saving a batch of ${batch.length} martyrs...`);
        const { error } = await supabase.from('martyrs').upsert(batch, {
          onConflict: 'id'
        });
        if (error) throw new Error(`Martyrs Batch Save Error: ${error.message}`);
        batch = []; // Reset the batch
      }
      console.log(`Fetched page ${page}.`);
      page++;
    } catch (e) {
      console.log(`Finished fetching martyrs pages. Error on page ${page}:`, e.message);
      break;
    }
  }
  // Save any remaining records in the last batch
  if (batch.length > 0) {
    console.log(`Saving the final batch of ${batch.length} martyrs...`);
    const { error } = await supabase.from('martyrs').upsert(batch, {
      onConflict: 'id'
    });
    if (error) throw new Error(`Martyrs Final Batch Save Error: ${error.message}`);
  }
  console.log('-> Success: All martyrs saved.');
}
