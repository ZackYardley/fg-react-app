import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        // Hide the header for all other routes.
        headerShown: false,
      }}
    >
      <Stack.Screen name="profile-settings" />
      <Stack.Screen name="purchase-history" />
      <Stack.Screen name="notifications-settings" />
    </Stack>
  );
}
