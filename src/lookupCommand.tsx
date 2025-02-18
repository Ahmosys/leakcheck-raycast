import { useState } from "react";
import { List, Icon, LaunchProps } from "@raycast/api";
import { getPreferenceValues } from "@raycast/api";
import BreachList from "@/components/BreachList";
import { useFetchBreaches } from "@/hooks/useFetchBreaches";
import { handleError } from "@/utils/error";
import { validateQuery } from "@/utils/validation";
import { Preferences } from "@/types/breach";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

export default function LookupCommand(props: LaunchProps<{ arguments: Arguments.LookupCommand }>) {
  const preferences = getPreferenceValues<Preferences>();
  const { query } = props.arguments;
  const [filter, setFilter] = useState<string>("all");

  try {
    validateQuery(query);
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(error);
      return (
        <List>
          <List.EmptyView
            icon={Icon.ExclamationMark}
            title={ERROR_MESSAGES.UI.INVALID_INPUT}
            description={error.message}
          />
        </List>
      );
    }
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title={ERROR_MESSAGES.UI.INVALID_INPUT}
          description={ERROR_MESSAGES.UI.UNEXPECTED_ERROR}
        />
      </List>
    );
  }

  const { isLoading, data, error } = useFetchBreaches(query, preferences.apiKey);

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title={ERROR_MESSAGES.UI.ERROR_TITLE}
          description={error.message || ERROR_MESSAGES.UI.UNEXPECTED_ERROR}
        />
      </List>
    );
  }

  return <BreachList isLoading={isLoading} data={data} filter={filter} setFilter={setFilter} />;
}
