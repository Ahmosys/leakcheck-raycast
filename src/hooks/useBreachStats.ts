import { useMemo } from "react";
import { BreachResult, BreachStats, RiskLevel } from "@/types/breach";
import { calculateRiskLevel } from "@/utils/stats";

/**
 * Custom hook that analyzes breach data and computes various statistics
 * @param breaches - Array of breach results to analyze
 * @returns BreachStats object containing:
 *  - totalBreaches: Total number of breaches found
 *  - passwordExposed: Number of breaches where password was exposed
 *  - verifiedSources: Number of verified breach sources
 *  - unverifiedSources: Number of unverified breach sources
 *  - mostRecentBreach: Date of the most recent breach
 *  - compromisedDataTypes: Map of compromised data types and their frequencies
 *  - timelineData: Map of breach counts by year
 *  - riskLevel: Calculated risk level based on breach statistics
 */
export function useBreachStats(breaches: BreachResult[]): BreachStats {
  return useMemo(() => {
    const stats: BreachStats = {
      totalBreaches: breaches.length,
      passwordExposed: 0,
      verifiedSources: 0,
      unverifiedSources: 0,
      mostRecentBreach: null,
      compromisedDataTypes: new Map(),
      timelineData: new Map(),
      riskLevel: RiskLevel.LOW,
    };

    breaches.forEach((breach) => {
      if (breach.password) stats.passwordExposed++;

      if (breach.source.unverified) {
        stats.unverifiedSources++;
      } else {
        stats.verifiedSources++;
      }

      if (breach.source.breach_date) {
        if (!stats.mostRecentBreach || breach.source.breach_date > stats.mostRecentBreach) {
          stats.mostRecentBreach = breach.source.breach_date;
        }
        const year = breach.source.breach_date.split("-")[0];
        stats.timelineData.set(year, (stats.timelineData.get(year) || 0) + 1);
      }

      breach.fields.forEach((field) => {
        stats.compromisedDataTypes.set(field, (stats.compromisedDataTypes.get(field) || 0) + 1);
      });
    });

    stats.riskLevel = calculateRiskLevel(stats);
    return stats;
  }, [breaches]);
}
