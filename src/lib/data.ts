import type { DailyStats, Martyr, LatestStats, InfrastructureStats } from '@/lib/types';

export const latestStats: LatestStats = {
  killed: 36586,
  children_killed: 15517,
  women_killed: 10279,
  press_killed: 147,
  medical_killed: 492,
  injured: 83074,
  homes_destroyed: 86000,
  detained: 9170,
};

export const historicalData: DailyStats[] = [
  { date: '2023-10-07', killed: 250, killed_children: 20, killed_women: 15, injured: 1500, detained: 50 },
  { date: '2023-11-01', killed: 9061, killed_children: 3760, killed_women: 2326, injured: 22000, detained: 1000 },
  { date: '2023-12-01', killed: 15523, killed_children: 6600, killed_women: 4400, injured: 41320, detained: 2500 },
  { date: '2024-01-01', killed: 22185, killed_children: 9400, killed_women: 6600, injured: 57035, detained: 4000 },
  { date: '2024-02-01', killed: 27131, killed_children: 11500, killed_women: 8000, injured: 66287, detained: 5500 },
  { date: '2024-03-01', killed: 30228, killed_children: 13230, killed_women: 8570, injured: 71377, detained: 7000 },
  { date: '2024-04-01', killed: 33037, killed_children: 14500, killed_women: 9560, injured: 75668, detained: 8000 },
  { date: '2024-05-01', killed: 34568, killed_children: 14944, killed_women: 9849, injured: 77765, detained: 8500 },
  { date: '2024-06-05', killed: 36586, killed_children: 15517, killed_women: 10279, injured: 83074, detained: 9170 },
];

const menKilled = latestStats.killed - latestStats.children_killed - latestStats.women_killed;

export const demographicsData = [
  { name: 'Children', value: latestStats.children_killed, fill: 'hsl(var(--chart-1))' },
  { name: 'Women', value: latestStats.women_killed, fill: 'hsl(var(--chart-2))' },
  { name: 'Men', value: menKilled > 0 ? menKilled : 0, fill: 'hsl(var(--chart-3))' },
];

export const infrastructureData: InfrastructureStats[] = [
    { type: 'Housing Units', destroyed: 86000, damaged: 300000 },
    { type: 'Hospitals', destroyed: 32, damaged: 53 },
    { type: 'Schools', destroyed: 138, damaged: 311 },
    { type: 'Mosques', destroyed: 243, damaged: 319 },
    { type: 'Churches', destroyed: 3, damaged: 5 },
];

export const martyrs: Martyr[] = [
  { id: 1, name: 'Ahmed Al-Astal', age: 16, sex: 'Male', date: '2023-10-22' },
  { id: 2, name: 'Layan Hamadeh', age: 10, sex: 'Female', date: '2023-11-05' },
  { id: 3, name: 'Yousef Al-Dous', age: 7, sex: 'Male', date: '2023-10-26' },
  { id: 4, name: 'Hind Rajab', age: 6, sex: 'Female', date: '2024-01-29' },
  { id: 5, name: 'Pliaa Al-sakani', age: 5, sex: 'Female', date: '2023-11-03' },
  { id: 6, name: 'Mohammed Zayid', age: 9, sex: 'Male', date: '2023-10-18' },
  { id: 7, name: 'Sidra Hassouna', age: 7, sex: 'Female', date: '2024-02-15' },
  { id: 8, name: 'Hamza Wael Al-Dahdouh', age: 27, sex: 'Male', date: '2024-01-07' },
  { id: 9, name: 'Reem Abu Lebdeh', age: 3, sex: 'Female', date: '2023-12-10' },
  { id: 10, name: 'Tala Abu Lebdeh', age: 8, sex: 'Female', date: '2023-12-10' },
  { id: 11, name: 'Refaat Alareer', age: 44, sex: 'Male', date: '2023-12-06' },
  { id: 12, name: 'Shireen Abu Akleh', age: 51, sex: 'Female', date: '2022-05-11' },
];
