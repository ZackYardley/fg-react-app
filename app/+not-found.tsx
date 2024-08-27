import { Stack } from "expo-router";
import { NotFoundComponent } from "@/components/common";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <NotFoundComponent />
    </>
  );
}
