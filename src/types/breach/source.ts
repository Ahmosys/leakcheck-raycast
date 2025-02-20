export interface BreachSource {
  name: string;
  breach_date?: string | null;
  unverified: number;
  passwordless: number;
  compilation: number;
}

export interface BreachResult {
  password?: string;
  source: BreachSource;
  email?: string;
  username?: string;
  fields: string[];
} 