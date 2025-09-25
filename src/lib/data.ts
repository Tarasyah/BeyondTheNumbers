
import type { DailyStats, Martyr, LatestStats, InfrastructureStats } from '@/lib/types';

// This file is no longer used for providing primary data, 
// but is kept for reference or potential fallback mechanisms.
// All data is now fetched from the Tech for Palestine API.

export const latestStats: LatestStats = {
  killed: 0,
  children_killed: 0,
  women_killed: 0,
  press_killed: 0,
  medical_killed: 0,
  injured: 0,
  homes_destroyed: 0,
  detained: 0,
};

export const historicalData: DailyStats[] = [];

export const demographicsData: any[] = [];

export const infrastructureData: InfrastructureStats[] = [];

export const martyrs: Martyr[] = [];
