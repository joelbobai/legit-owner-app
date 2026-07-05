import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="device/[id]"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="register-device"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="report-stolen"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="cancel-stolen-report"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="transfer-seller"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="transfer-buyer"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="transfer-complete"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="privacy-settings"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
