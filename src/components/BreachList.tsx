import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import BreachDetail from "./BreachDetails";
import { ApiResponse } from "../types/breach";
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
            <List.Dropdown.Item title="All Results" value="all" icon={Icon.List} />
            <List.Dropdown.Item title="Password Found" value="password" icon={Icon.Eye} />
            <List.Dropdown.Item title="No Password" value="nopassword" icon={Icon.EyeDisabled} />
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
                source: breach.password ? Icon.Eye : Icon.EyeDisabled,
                tintColor: breach.password ? Color.Orange : Color.SecondaryText,
              }}
              accessories={[
                {
                  text: breach.password ? "Password Exposed" : "Password Safe",
                  icon: breach.password 
                    ? { source: Icon.ExclamationMark, tintColor: Color.Orange }
                    : { source: Icon.Checkmark, tintColor: Color.Green },
                },
                {
                  text: breach.source.unverified ? "Unverified Source" : "Verified Source",
                  icon: {
                    source: breach.source.unverified ? Icon.QuestionMark : Icon.Checkmark,
                    tintColor: breach.source.unverified ? Color.Yellow : Color.Green,
                  },
                },
              ]}
              actions={
                <ActionPanel>
                  <Action.Push
                    title="View Breach Details"
                    icon={Icon.Sidebar}
                    target={<BreachDetail breach={breach} />}
                    shortcut={{ modifiers: ["cmd"], key: "d" }}
                  />
                  {breach.password && (
                    <Action.CopyToClipboard
                      title="Copy Exposed Password"
                      icon={Icon.Clipboard}
                      content={breach.password}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                  )}
                  <Action
                    title="Export Results to Excel"
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
          icon={Icon.Shield}
          title="No Data Breaches Found"
          description="Try a different email / username or adjust the filter."
        />
      )}
    </List>
  );
}
