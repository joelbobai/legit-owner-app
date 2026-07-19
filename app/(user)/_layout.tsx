import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function UserLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn) return <Redirect href={"/(auth)" as any} />;

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
