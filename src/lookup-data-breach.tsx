import { useState, useMemo } from "react";
import {
  List,
  Detail,
  Action,
  ActionPanel,
  showToast,
  Icon,
  Toast,
  Color,
  getPreferenceValues,
  LaunchProps,
} from "@raycast/api";
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

export default function LookupCommand(props: LaunchProps<{ arguments: Arguments.LookupDataBreach }>) {
  const preferences = getPreferenceValues<Preferences>();
  const { email } = props.arguments;
  const [filter, setFilter] = useState<string>("all");

  if (!preferences.apiKey) {
    showToast({
      style: Toast.Style.Failure,
      title: "API Key Missing",
      message: "Please add your API key in preferences.",
    });
    return null;
  }

  const { isLoading, data, error } = useFetch<ApiResponse>(
    `https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}`,
    {
      headers: { "X-API-Key": preferences.apiKey },
      execute: !!email,
    },
  );

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error Fetching Data"
          description={error.message || "An unknown error occurred"}
        />
      </List>
    );
  }

  const filteredResults = useMemo(() => {
    return (
      data?.result.filter((breach) => {
        if (filter === "password") return !!breach.password;
        if (filter === "nopassword") return !breach.password;
        return true;
      }) || []
    );
  }, [data, filter]);

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter any keyword to filter results"
      searchBarAccessory={
        <List.Dropdown tooltip="Filter Results" storeValue defaultValue="all" onChange={setFilter}>
          <List.Dropdown.Section title="Password Status">
            <List.Dropdown.Item title="All" value="all" />
            <List.Dropdown.Item title="Password Found" value="password" />
            <List.Dropdown.Item title="No Password" value="nopassword" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {data && (
        <List.Section title={`Quota: ${data.quota || "N/A"} Requests Remaining`}>
          {filteredResults.map((breach, index) => (
            <List.Item
              key={index}
              title={breach.source.name}
              subtitle={`Breach date: ${breach.source.breach_date || "N/A"}`}
              icon={{
                source: breach.password ? Icon.LockUnlocked : Icon.Lock,
                tintColor: breach.password ? Color.Green : Color.Red,
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
                <ActionPanel>
                  <Action.Push
                    title="View Details"
                    icon={Icon.Document}
                    target={<BreachDetail breach={breach} />}
                    shortcut={{ modifiers: ["cmd"], key: "d" }}
                  />
                  {breach.password && (
                    <Action.CopyToClipboard
                      title="Copy Password"
                      content={breach.password}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                  )}
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}

      {!isLoading && filteredResults.length === 0 && (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No breaches found"
          description="Try a different email or adjust the filter."
        />
      )}
    </List>
  );
}

function BreachDetail({ breach }: { breach: BreachResult }) {
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
          <Detail.Metadata.Label
            title="Verification Status"
            text={breach.source.unverified ? "Unverified" : "Verified"}
          />
          <Detail.Metadata.Label title="Provide from compilation" text={breach.source.compilation ? "Yes" : "No"} />
        </Detail.Metadata>
      }
    />
  );
}
