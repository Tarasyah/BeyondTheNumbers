export interface DailyStats {
  date: string;
  killed: number;
  killed_children: number;
  killed_women: number;
  injured: number;
  detained: number;
}

export interface Martyr {
  id: number;
  name: string;
  age: number | string;
  sex: 'Male' | 'Female';
  date: string;
}

export interface LatestStats {
  killed: number;
  children_killed: number;
  women_killed: number;
  press_killed: number;
  medical_killed: number;
  injured: number;
  homes_destroyed: number;
  detained: number;
}

export interface InfrastructureStats {
  type: string;
  destroyed: number;
  damaged: number;
}
