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
  id: number; // Changed from string to number for sorting and key purposes
  name: string;
  en_name: string;
  dob: string | null; // Allow null for dob
  sex: "m" | "f";
  age: number | null; // Allow null for age
  source?: string;
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

// Guestbook Entry Type
export interface GuestbookEntry {
  id: number;
  created_at: string;
  content: string;
  author_name: string;
  is_approved: boolean;
}

// Tipe yang terkait dengan otentikasi tidak lagi digunakan secara aktif
// setelah penghapusan fungsionalitas login, tetapi dibiarkan
// untuk menghindari error pada referensi yang mungkin tersisa.
export interface Profile {
  id: string;
  role: 'user' | 'admin';
  username: string | null;
}

// Post type is no longer used for the admin dashboard
export interface Post {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  profiles: { username: string | null } | null;
}
