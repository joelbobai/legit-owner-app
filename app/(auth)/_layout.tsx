import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (isLoggedIn) return <Redirect href={"/(user)" as any} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
