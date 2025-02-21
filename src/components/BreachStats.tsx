import { Detail, Icon, Color } from "@raycast/api";
import { BreachResult } from "@/types/breach";
import type { BreachStats } from "@/types/breach";
import { useBreachStats } from "@/hooks/useBreachStats";
import { formatBreachDate } from "@/utils/date";
import {
  generateTimelineChart,
  generateDataTypesChart,
  getRiskIcon,
  generateRiskAssessment,
  generateRecommendations,
} from "../utils/stats";

export function BreachStats({ breaches }: { breaches: BreachResult[] }) {
  const stats = useBreachStats(breaches);

  return (
    <Detail
      navigationTitle="Breach Statistics"
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Overview">
            <Detail.Metadata.TagList.Item
              text={`${breaches.length} Total Breaches`}
              color={Color.Blue}
              icon={Icon.List}
            />
            <Detail.Metadata.TagList.Item
              text={`${stats.passwordExposed} Passwords Exposed`}
              color={stats.passwordExposed > 0 ? Color.Orange : Color.Green}
              icon={stats.passwordExposed > 0 ? Icon.ExclamationMark : Icon.Checkmark}
            />
          </Detail.Metadata.TagList>

          <Detail.Metadata.Separator />

          <Detail.Metadata.Label
            title="Source Verification"
            text={`${stats.verifiedSources} Verified / ${stats.unverifiedSources} Unverified`}
            icon={Icon.Shield}
          />

          <Detail.Metadata.Label
            title="Most Recent Breach"
            text={formatBreachDate(stats.mostRecentBreach) || "Unknown"}
            icon={Icon.Calendar}
          />

          <Detail.Metadata.Label title="Risk Level" text={stats.riskLevel} icon={getRiskIcon(stats)} />
        </Detail.Metadata>
      }
      markdown={generateStatsMarkdown(stats)}
    />
  );
}

function generateStatsMarkdown(stats: BreachStats) {
  const timelineChart = generateTimelineChart(stats.timelineData);
  const dataTypesChart = generateDataTypesChart(stats.compromisedDataTypes);
  const riskAssessment = generateRiskAssessment(stats);
  const recommendations = generateRecommendations(stats);

  return `
# Security Analysis

## Timeline of Breaches
\`\`\`
${timelineChart}
\`\`\`

## Compromised Data Types
\`\`\`
${dataTypesChart}
\`\`\`

## Risk Assessment
${riskAssessment}

## Recommendations
${recommendations}
`;
}
