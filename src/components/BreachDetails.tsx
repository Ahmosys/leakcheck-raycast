import { Detail } from "@raycast/api";
import { BreachResult } from "../types/breach";

export default function BreachDetail({ breach }: { breach: BreachResult }) {
  return (
    <Detail
      markdown={`
# Breach Source: **${breach.source.name}**
- 📨 **Email**: ${breach.email}
- 🔐 **Password**: ${breach.password || "Not available"}
- 📅 **Breach Date**: ${breach.source.breach_date || "Unknown"}
- 📋 **Fields**: ${breach.fields.length ? breach.fields.join(", ") : "No additional details"}
`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Verification" text={breach.source.unverified ? "Unverified" : "Verified"} />
          <Detail.Metadata.Label title="Compilation" text={breach.source.compilation ? "Yes" : "No"} />
        </Detail.Metadata>
      }
    />
  );
}
