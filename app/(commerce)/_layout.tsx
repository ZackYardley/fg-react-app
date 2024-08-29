import { Stack } from "expo-router";

export default function CommerceLayout() {
  return (
    <Stack
      screenOptions={{
        // Hide the header for all other routes.
        headerShown: false,
      }}
    >
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="carbon-credit-sub" />
      <Stack.Screen name="shopping-cart" />
      <Stack.Screen name="purchase-complete" />
    </Stack>
  );
}
