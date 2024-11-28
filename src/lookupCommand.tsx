import { useState } from "react";
import { showToast, Toast, getPreferenceValues, List, Icon, LaunchProps } from "@raycast/api";
import { useFetchBreaches } from "./hooks/useFetchBreaches";
import BreachList from "./components/BreachList";
import { Preferences } from "./types/breach";

export default function LookupCommand(props: LaunchProps<{ arguments: Arguments.LookupCommand }>) {
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

  const { isLoading, data, error } = useFetchBreaches(email, preferences.apiKey);

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

  return <BreachList isLoading={isLoading} data={data} filter={filter} setFilter={setFilter} />;
}
