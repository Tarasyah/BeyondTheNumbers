
import type { Summary, GazaDailyCasualties, InfrastructureDamaged, Martyr } from "@/lib/types";

const BASE_URL = "https://data.techforpalestine.org/api/v2";
const BASE_URL_V3 = "https://data.techforpalestine.org/api/v3";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json() as Promise<T>;
}

export function getSummary(): Promise<Summary> {
  return fetcher<Summary>(`${BASE_URL_V3}/summary.min.json`);
}

export function getGazaDailyCasualties(): Promise<{gazadaily: GazaDailyCasualties[]}> {
  return fetcher<{gazadaily: GazaDailyCasualties[]}>(`${BASE_URL}/casualties_daily.min.json`);
}

export function getInfrastructureDamaged(): Promise<{ "infrastructure-damaged": InfrastructureDamaged[] }> {
    return fetcher<{ "infrastructure-damaged": InfrastructureDamaged[] }>(`${BASE_URL_V3}/infrastructure-damaged.min.json`);
}

export function getMartyrs(): Promise<{ killed_in_gaza: Martyr[] }> {
    return fetcher<{killed_in_gaza: Martyr[]}>(`${BASE_URL}/killed-in-gaza/page-1.json`);
}
