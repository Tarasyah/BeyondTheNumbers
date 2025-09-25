
export interface GazaDailyCasualties {
  date: string;
  cumulative_killed: number;
  cumulative_injured: number;
  killed_today: number;
  injured_today: number;
}

export interface WestBankDailyCasualties {
    date: string;
    killed_cum: number;
    injured_cum: number;
    detained_cum: number;
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
    quantity: number;
    notes: string;
    last_update: string;
}
