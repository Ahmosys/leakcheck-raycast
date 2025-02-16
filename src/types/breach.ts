export interface Preferences {
  apiKey: string;
}

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
  email: string;
  fields: string[];
}

export interface ApiResponse {
  success: boolean;
  quota: number;
  found: number;
  result: BreachResult[];
}
