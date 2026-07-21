import { Stack } from "expo-router";

import { DeviceRegistrationProvider } from "@/context/DeviceRegistrationContext";

export default function RegisterDeviceLayout() {
  return (
    <DeviceRegistrationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="step1" />
        <Stack.Screen name="step2" />
        <Stack.Screen name="step3" />
        <Stack.Screen name="step4" />
        <Stack.Screen name="complete" />
        <Stack.Screen name="continue" />
      </Stack>
    </DeviceRegistrationProvider>
  );
}
