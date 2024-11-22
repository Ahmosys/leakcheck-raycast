import { useState } from "react";
import { List, Detail, Action, ActionPanel, showToast, Icon, Toast, Color, getPreferenceValues } from "@raycast/api";
import { useFetch } from "@raycast/utils";

interface Preferences {
  apiKey: string;
}

interface BreachSource {
  name: string;
  breach_date?: string | null;
  unverified: number;
  passwordless: number;
  compilation: number;
}

interface BreachResult {
  password?: string;
  source: BreachSource;
  email: string;
  fields: string[];
}

interface ApiResponse {
  success: boolean;
  quota: number;
  found: number;
  result: BreachResult[];
}

export default function LookupCommand() {
  const preferences = getPreferenceValues<Preferences>();
  const [email, setEmail] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const { isLoading, data, error } = useFetch<ApiResponse>(
    `https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}`,
    {
      headers: {
        "X-API-Key": preferences.apiKey,
      },
      execute: !!email,
      keepPreviousData: true,
    },
  );

  if (error) {
    showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: error.message,
    });
  }

  const filteredResults =
    data?.result.filter((breach) => {
      if (filter === "verified") return !breach.source.unverified;
      if (filter === "unverified") return breach.source.unverified;
      return true;
    }) || [];

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter email to lookup"
      onSearchTextChange={setEmail}
      throttle
      searchBarAccessory={
        <List.Dropdown tooltip="Filter Results" storeValue onChange={(value) => setFilter(value)}>
          <List.Dropdown.Section title="Verification Status">
            <List.Dropdown.Item title="All" value="all" />
            <List.Dropdown.Item title="Verified" value="verified" />
            <List.Dropdown.Item title="Unverified" value="unverified" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {filteredResults.length > 0 ? (
        filteredResults.map((breach, index) => (
          <List.Item
            key={index}
            title={breach.source.name}
            subtitle={`Breach date: ${breach.source.breach_date || "N/A"}`}
            icon={{
              source: breach.password ? Icon.LockUnlocked : Icon.Lock,
              tintColor: breach.source.unverified ? Color.Red : Color.Green,
            }}
            accessories={[
              {
                text: `Password: ${breach.password ? "Found" : "Not Found"}`,
                icon: breach.password
                  ? { source: Icon.ExclamationMark, tintColor: Color.Red }
                  : { source: Icon.CheckCircle, tintColor: Color.Green },
              },
              {
                text: breach.source.unverified ? "Unverified" : "Verified",
                icon: {
                  source: Icon.Shield,
                  tintColor: breach.source.unverified ? Color.Yellow : Color.Green,
                },
              },
            ]}
            actions={
              <ActionPanel title={breach.source.name}>
                <Action.Push title="View Details" icon={Icon.Document} target={<BreachDetail breach={breach} />} />
                {breach.password && (
                  <Action.CopyToClipboard
                    title="Copy Password to Clipboard"
                    content={breach.password}
                    shortcut={{ modifiers: ["cmd"], key: "c" }}
                  />
                )}
              </ActionPanel>
            }
          />
        ))
      ) : (
        <List.EmptyView title="No breaches found" />
      )}
    </List>
  );
}

function BreachDetail({ breach }: { breach: BreachResult }) {
  return (
    <Detail
      markdown={`
# Source: ${breach.source.name}
- **Email**: ${breach.email}
- **Password**: ${breach.password || "Not available"}
- **Breach Date**: ${breach.source.breach_date || "Unknown"}
- **Fields**: ${breach.fields.join(", ")}
      `}
    />
  );
}
