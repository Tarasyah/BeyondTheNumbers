// src/app/martyrs/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import type { Martyr } from "@/lib/types";

const MARTYRS_PER_PAGE = 100;

type FetchMartyrsParams = {
  page: number;
  sort: string;
};

export async function fetchMartyrs({ page, sort }: FetchMartyrsParams): Promise<Martyr[]> {
  const supabase = createClient();
  const from = (page - 1) * MARTYRS_PER_PAGE;
  const to = from + MARTYRS_PER_PAGE - 1;

  let query = supabase
    .from("martyrs")
    .select("*")
    .range(from, to);

  // Apply sorting based on the sort parameter
  switch (sort) {
    case 'name-asc':
      query = query.order('en_name', { ascending: true });
      break;
    case 'name-desc':
      query = query.order('en_name', { ascending: false });
      break;
    case 'age-asc':
      query = query.order('age', { ascending: true, nullsFirst: false });
      break;
    case 'age-desc':
      query = query.order('age', { ascending: false, nullsFirst: false });
      break;
    case 'latest':
    default:
      query = query.order('id', { ascending: false });
      break;
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching martyrs:", error);
    return [];
  }

  // Ensure data is not null before returning
  return data || [];
}
