import type { Plan } from "src/services/apis/plansApi";

export interface AuthUser {
    email?: string;
    avatar?: string;
    telephone?: string;
    name?: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
    is_completed_onboarding?: boolean;
    interests?: string[] | null;
    heard_about_us?: string | null;
    subscription?: Plan;
    credits?: {
      used: number;
      total: number;
    };
  }