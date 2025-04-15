
export interface AuthUser {
    email?: string;
    avatar?: string;
    telephone?: string;
    name?: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
    subscription?: {
      plan: string;
      startDate?: string;
      endDate?: string;
      status?: string;
    };
    credits?: {
      used: number;
      total: number;
    };
  }