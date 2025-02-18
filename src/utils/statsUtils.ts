import { Icon } from "@raycast/api";
import { BreachStats, RiskLevel } from "../types/breach";

/**
 * Calculates the risk level based on breach statistics
 * Uses a weighted scoring system:
 * - Password exposure: 30 points per breach
 * - Verified sources: 10 points per source
 * - Compromised data types: 5 points per type
 *
 * @param stats - Breach statistics object containing exposure metrics
 * @returns {RiskLevel} Calculated risk level (HIGH, MEDIUM, or LOW)
 */
export function calculateRiskLevel(stats: BreachStats): RiskLevel {
  const score =
    (stats.passwordExposed * 30 + stats.verifiedSources * 10 + stats.compromisedDataTypes.size * 5) /
    (stats.verifiedSources + stats.unverifiedSources);

  if (score > 50) return RiskLevel.HIGH;
  if (score > 25) return RiskLevel.MEDIUM;
  return RiskLevel.LOW;
}

/**
 * Generates a text-based timeline chart of breaches by year
 * Uses Unicode block characters to create a visual bar chart
 *
 * @param timelineData - Map of years to number of breaches
 * @returns {string} Formatted string containing the timeline visualization
 */
export function generateTimelineChart(timelineData: Map<string, number>): string {
  const sortedYears = Array.from(timelineData.keys()).sort();
  const maxBreaches = Math.max(...timelineData.values());

  return sortedYears
    .map((year) => {
      const count = timelineData.get(year) || 0;
      const bars = "█".repeat(Math.floor((count / maxBreaches) * 20));
      return `${year} | ${bars} (${count})`;
    })
    .join("\n");
}

/**
 * Generates a bar chart of the top 5 most compromised data types
 * Uses Unicode block characters to create a visual representation
 *
 * @param dataTypes - Map of data types to their frequency of occurrence
 * @returns {string} Formatted string containing the data types visualization
 */
export function generateDataTypesChart(dataTypes: Map<string, number>): string {
  const sortedTypes = Array.from(dataTypes.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = Math.max(...sortedTypes.map(([, count]) => count));

  return sortedTypes
    .map(([type, count]) => {
      const bars = "█".repeat(Math.floor((count / maxCount) * 20));
      return `${type.padEnd(15)} | ${bars} (${count})`;
    })
    .join("\n");
}

/**
 * Determines the appropriate icon to display based on breach statistics
 * Shows warning icon if passwords were exposed, checkmark otherwise
 *
 * @param stats - Breach statistics object
 * @returns {Icon} Icon.ExclamationMark for password exposure, Icon.Checkmark otherwise
 */
export function getRiskIcon(stats: BreachStats): Icon {
  return stats.passwordExposed > 0 ? Icon.ExclamationMark : Icon.Checkmark;
}

/**
 * Generates a risk assessment summary based on breach statistics
 * Includes critical warnings and potential security concerns
 *
 * @param stats - Breach statistics object
 * @returns {string} Markdown-formatted string containing risk assessment points
 */
export function generateRiskAssessment(stats: BreachStats): string {
  const points = [];

  if (stats.passwordExposed > 0) {
    points.push("- 🚨 **Critical**: Passwords have been exposed");
  }

  if (stats.unverifiedSources > stats.verifiedSources) {
    points.push("- ⚠️ **Warning**: Many unverified breach sources");
  }

  if (stats.compromisedDataTypes.size > 3) {
    points.push("- ⚠️ **Warning**: Multiple types of data compromised");
  }

  return points.length ? points.join("\n") : "- ✅ **Low Risk Profile**";
}

/**
 * Generates security recommendations based on breach statistics
 * Provides actionable steps to improve security
 *
 * @param stats - Breach statistics object
 * @returns {string} Markdown-formatted string containing security recommendations
 */
export function generateRecommendations(stats: BreachStats): string {
  const recs = [];

  if (stats.passwordExposed > 0) {
    recs.push("- Change all exposed passwords immediately");
    recs.push("- Enable 2FA where available");
  }

  if (stats.compromisedDataTypes.has("email")) {
    recs.push("- Monitor email for suspicious activity");
  }

  if (stats.compromisedDataTypes.has("phone")) {
    recs.push("- Be aware of potential phishing calls/SMS");
  }

  return recs.length ? recs.join("\n") : "- Continue monitoring for new breaches";
}
