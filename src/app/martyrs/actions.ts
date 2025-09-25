"use server";

import { createClient } from "@/utils/supabase/server";

const MARTYRS_PER_PAGE = 100;

export async function fetchMartyrs({ page }: { page: number }) {
  const supabase = createClient();
  const from = (page - 1) * MARTYRS_PER_PAGE;
  const to = from + MARTYRS_PER_PAGE - 1;

  const { data, error } = await supabase
    .from("martyrs")
    .select("*")
    .range(from, to)
    .order('id', { ascending: false });

  if (error) {
    console.error("Error fetching martyrs:", error);
    return [];
  }

  return data;
}
