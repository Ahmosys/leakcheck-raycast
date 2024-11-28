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
import * as XLSX from "xlsx";
import os from "os";
import path from "path";

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

export default function LookupCommand(props: LaunchProps<{ arguments: Arguments.LookupCommand }>) {
  const preferences = getPreferenceValues<Preferences>();
  const { email } = props.arguments;
  const [filter, setFilter] = useState<string>("all");

  if (!preferences.apiKey) {
    showToast({
      style: Toast.Style.Failure,
      title: "API Key Missing",
      message: "Please add your API key in preferences",
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

  const filteredResults = useMemo(() => {
    return (
      data?.result.filter((breach) => {
        if (filter === "password") return !!breach.password;
        if (filter === "nopassword") return !breach.password;
        return true;
      }) || []
    );
  }, [data, filter]);

  async function exportToExcel(data: BreachResult[]) {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: "No Data to Export",
          message: "There are no breaches to export.",
        });
        return;
      }

      // Format breaches into rows for Excel
      const rows = data.map((breach) => ({
        Email: breach.email,
        Source: breach.source.name,
        "Breach Date": breach.source.breach_date || "N/A",
        Password: breach.password || "N/A",
        Verified: breach.source.unverified ? "No" : "Yes",
        Fields: breach.fields.join(", ") || "None",
      }));

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Breaches");

      // Save the file to desktop
      const desktopPath = path.join(os.homedir(), "Desktop", "breaches.xlsx");
      XLSX.writeFile(workbook, desktopPath);

      await showToast({
        style: Toast.Style.Success,
        title: "Export Successful",
        message: `File saved to your desktop.`,
      });
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Export Failed",
        message: err instanceof Error ? err.message : "An unknown error occurred.",
      });
    }
  }

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error Fetching Data"
          description={error.message || "An unknown error occurred."}
        />
      </List>
    );
  }

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
                  <Action
                    title="Export All to Excel"
                    icon={Icon.Download}
                    onAction={() => exportToExcel(data?.result || [])}
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                  />
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
          <Detail.Metadata.Label title="Verification" text={breach.source.unverified ? "Unverified" : "Verified"} />
          <Detail.Metadata.Label title="Compilation" text={breach.source.compilation ? "Yes" : "No"} />
        </Detail.Metadata>
      }
    />
  );
}
