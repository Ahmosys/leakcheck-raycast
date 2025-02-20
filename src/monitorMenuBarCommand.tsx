import { MenuBarExtra, getPreferenceValues, Icon, openCommandPreferences, showToast, Toast } from "@raycast/api";
import { useFetchBreaches } from "@/hooks/useFetchBreaches";
import { Preferences } from "@/types/api";
import { formatBreachDate } from "@/utils/date";

export default function MenuBarCommand() {
  const preferences = getPreferenceValues<Preferences>();
  
  if (!preferences.monitoredEmail) {
    showToast({
      style: Toast.Style.Failure,
      title: "Configuration Required",
      message: "Please configure an email address to monitor",
    });
    openCommandPreferences();
    return null;
  }

  const { isLoading, data, error } = useFetchBreaches(preferences.monitoredEmail, preferences.apiKey);

  if (error) {
    return (
      <MenuBarExtra icon={Icon.ExclamationMark} tooltip="Leakcheck Error">
        <MenuBarExtra.Item title="Loading Error" />
      </MenuBarExtra>
    );
  }

  const breachesWithPasswords = data?.result.filter((breach) => breach.password) || [];
  const breachesWithoutPasswords = data?.result.filter((breach) => !breach.password) || [];
  const totalBreaches = (data?.result || []).length;

  return (
    <MenuBarExtra
      icon={totalBreaches > 0 ? Icon.LockUnlocked : Icon.Lock}
      title={`${totalBreaches} breaches`}
      tooltip={`Leakcheck - ${totalBreaches} breaches detected`}
      isLoading={isLoading}
    >
      <MenuBarExtra.Section title={`Monitoring ${preferences.monitoredEmail}`}>
        <MenuBarExtra.Item
          title={`${totalBreaches} Breaches Found`}
          icon={Icon.List}
          onAction={() => {}}
        />
      </MenuBarExtra.Section>

      {breachesWithPasswords.length > 0 && (
        <MenuBarExtra.Section title="Breaches with Passwords">
          {breachesWithPasswords.map((breach, index) => (
            <MenuBarExtra.Item
              key={index}
              title={breach.source.name}
              subtitle={formatBreachDate(breach.source.breach_date)}
              icon={Icon.Eye}
              onAction={() => {}}
            />
          ))}
        </MenuBarExtra.Section>
      )}

      {breachesWithoutPasswords.length > 0 && (
        <MenuBarExtra.Section title="Other Breaches">
          {breachesWithoutPasswords.map((breach, index) => (
            <MenuBarExtra.Item
              key={index}
              title={breach.source.name}
              subtitle={formatBreachDate(breach.source.breach_date)}
              icon={Icon.EyeDisabled}
              onAction={() => {}}
            />
          ))}
        </MenuBarExtra.Section>
      )}
    </MenuBarExtra>
  );
} 