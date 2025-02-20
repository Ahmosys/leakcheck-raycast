import { Action, ActionPanel, Color, Detail, Icon } from "@raycast/api";
import { BreachResult } from "@/types/breach";
import { formatBreachDate } from "@/utils/date";

export default function BreachDetail({ breach }: { breach: BreachResult }) {
  return (
    <Detail
      navigationTitle={`Breach Details - ${breach.source.name}`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Status">
            <Detail.Metadata.TagList.Item
              text={breach.source.unverified ? "Unverified Source" : "Verified Source"}
              color={breach.source.unverified ? Color.Yellow : Color.Green}
              icon={breach.source.unverified ? Icon.QuestionMark : Icon.Checkmark}
            />
            {breach.password ? (
              <Detail.Metadata.TagList.Item text="Password Exposed" color={Color.Orange} icon={Icon.ExclamationMark} />
            ) : (
              <Detail.Metadata.TagList.Item text="Password Safe" color={Color.Green} icon={Icon.Lock} />
            )}
          </Detail.Metadata.TagList>

          <Detail.Metadata.Separator />

          {breach.email && <Detail.Metadata.Label title="Email" text={breach.email} icon={Icon.Envelope} />}

          {breach.username && <Detail.Metadata.Label title="Username" text={breach.username} icon={Icon.Person} />}

          {breach.password && <Detail.Metadata.Label title="Password" text={breach.password} icon={Icon.Key} />}

          <Detail.Metadata.Label
            title="Breach Date"
            text={formatBreachDate(breach.source.breach_date)}
            icon={Icon.Calendar}
          />

          {breach.fields.length > 0 && (
            <Detail.Metadata.TagList title="Compromised Data">
              {breach.fields.map((field, index) => (
                <Detail.Metadata.TagList.Item key={index} text={field} color={Color.SecondaryText} />
              ))}
            </Detail.Metadata.TagList>
          )}

          <Detail.Metadata.Separator />

          <Detail.Metadata.Label
            title="Source Type"
            text={breach.source.compilation ? "Compilation" : "Single Source"}
            icon={breach.source.compilation ? Icon.List : Icon.Document}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          {breach.password && (
            <Action.CopyToClipboard
              title="Copy Password"
              content={breach.password}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
          )}
          {breach.email && (
            <Action.CopyToClipboard
              title="Copy Email"
              content={breach.email}
              shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
            />
          )}
        </ActionPanel>
      }
      markdown={getMarkdownContent(breach)}
    />
  );
}

function getMarkdownContent(breach: BreachResult): string {
  const sourceStatus = breach.source.unverified
    ? "⚠️ **Unverified Source** - This data comes from an unverified source and should be treated with caution."
    : "✅ **Verified Source** - This data comes from a confirmed data breach.";

  const securityStatus = breach.password
    ? "### 🚨 Security Alert\nYour password has been exposed in this data breach. It is strongly recommended to:\n- Change this password immediately.\n- Change it on other sites if you've used it elsewhere.\n- Enable 2FA where possible."
    : "### ✅ Password Status\nNo password was exposed in this breach. However, other sensitive information may have been compromised.";

  const compromisedData = breach.fields.length
    ? `### 📋 Compromised Information\nThe following data was exposed in this breach:\n${breach.fields.map((field) => `- \`${field}\``).join("\n")}`
    : "### 📋 Compromised Information\nNo detailed information available about the specific data exposed in this breach.";

  const sourceType = breach.source.compilation
    ? "This breach is part of a larger compilation of multiple data breaches."
    : "This breach comes from a single source.";

  return `
# ${breach.source.name}

${sourceStatus}

---

${securityStatus}

---

${compromisedData}

---

### ℹ️ Additional Information
- **Breach Date**: ${formatBreachDate(breach.source.breach_date)}
- **Source Type**: ${sourceType}

> 🔒 **Security Reminder**: Always use unique, strong passwords and enable two-factor authentication when possible.
`;
}
