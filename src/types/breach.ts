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

export interface BreachStats {
  totalBreaches: number;
  passwordExposed: number;
  verifiedSources: number;
  unverifiedSources: number;
  mostRecentBreach: string | null;
  compromisedDataTypes: Map<string, number>;
  timelineData: Map<string, number>;
  riskLevel: RiskLevel;
}

export interface ApiResponse {
  success: boolean;
  quota: number;
  found: number;
  result: BreachResult[];
}

export enum RiskLevel {
  LOW = "Low Risk",
  MEDIUM = "Medium Risk",
  HIGH = "High Risk",
}
