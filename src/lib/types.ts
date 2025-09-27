export interface DailyCasualties {
  date: string;
  cumulative_killed: number;
  cumulative_injured: number;
  killed_today: number;
  injured_today: number;
}
export interface GazaDailyCasualties extends DailyCasualties {}

export interface WestBankDailyCasualties {
    date: string;
    killed_cum: number;
    injured_cum: number;
}

export interface Martyr {
  name: string;
  en_name: string;
  id?: string;
  dob: string;
  sex: "m" | "f";
  age: number;
  source: string;
}

export interface Summary {
  latest_update_date: string;
  killed: {
    total: number;
    children: number;
    women: number;
    press: number;
    medical: number;
  };
  injured: {
    total: number;
  };
  detained: number;
  killed_genders: {
      male: number;
      female: number;
  };
  killed_age_groups: {
      child: number;
  }
}

export interface InfrastructureDamaged {
    type: string;
    quantity?: number; // Make quantity optional
    destroyed?: number;
    damaged?: number;
    notes: string;
    last_update: string;
}

// Types for Feed Feature
export interface Profile {
  id: string;
  role: 'user' | 'admin';
  username: string | null;
}

export interface Post {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  profiles: Profile | null; // A post is created by one profile
}
