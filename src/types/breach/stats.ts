import { RiskLevel } from './enums';

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