
export interface GazaDailyCasualties {
  date: string;
  cumulative_killed: number;
  cumulative_injured: number;
  killed_today: number;
  injured_today: number;
}

export interface WestBankDailyCasualties {
    date: string;
    cumulative_killed: number;
    cumulative_settler_attacks: number;
    killed_today: number;
    injured_today: number;
    settler_attacks_today: number;
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


export interface Summary {
  gaza: {
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
  };
  west_bank: {
    latest_update_date: string;
    killed: number;
    injured: number;
    detained: number;
    settler_attacks: number;
  };
}

export interface InfrastructureDamaged {
    type: string;
    quantity: number;
    percentage_of_total?: number;
    notes: string;
    source: string;
    last_update: string;
}
