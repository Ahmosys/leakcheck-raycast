import { List, Icon, Color, ActionPanel, Action } from "@raycast/api";
import { ApiResponse } from "../types/breach";
import BreachDetail from "./BreachDetails";
import { exportToExcel } from "../utils/exportToExcel";

export default function BreachList({
  isLoading,
  data,
  filter,
  setFilter,
}: {
  isLoading: boolean;
  data?: ApiResponse;
  filter: string;
  setFilter: (filter: string) => void;
}) {
  const filteredResults =
    data?.result
      .filter((breach) => {
        if (filter === "password") return !!breach.password;
        if (filter === "nopassword") return !breach.password;
        return true;
      })
      .sort((a, b) => {
        // Sort by password presence: Password found first
        return (b.password ? 1 : 0) - (a.password ? 1 : 0);
      }) || [];

  const totalResults = filteredResults.length;

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
        <List.Section
          title={`Found: ${totalResults} Breach${totalResults !== 1 ? "es" : ""}`}
          subtitle={`Quota: ${data.quota || "N/A"} Requests Remaining`}
        >
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
      {!isLoading && totalResults === 0 && (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No breaches found"
          description="Try a different email or adjust the filter."
        />
      )}
    </List>
  );
}
