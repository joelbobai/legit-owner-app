import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type PhonePlatform = "android" | "ios" | "other";

export type PhoneIdentity = {
  platformDeviceId: string | null;
  platform: PhonePlatform;
  appInstanceId: string;
  deviceLabel: string;
};

const APP_INSTANCE_KEY = "appInstanceId";

let cached: Promise<PhoneIdentity> | null = null;

// Stable per-physical-phone ID. ANDROID_ID survives reinstall; iOS vendor ID
// identifies the physical phone (different on each phone, even identical models).
async function getPlatformDeviceId(): Promise<{ id: string | null; platform: PhonePlatform }> {
  try {
    if (Platform.OS === "android") {
      const id = await Application.getAndroidId();
      return { id: id ?? null, platform: "android" };
    }
    if (Platform.OS === "ios") {
      const id = await Application.getIosIdForVendorAsync();
      return { id: id ?? null, platform: "ios" };
    }
  } catch {
    // restricted devices / simulators
  }
  return { id: null, platform: "other" };
}

// Our own per-install UUID (SecureStore backup for reinstall edge cases).
async function getAppInstanceId(): Promise<string> {
  try {
    const existing = await SecureStore.getItemAsync(APP_INSTANCE_KEY);
    if (existing) return existing;
  } catch {
    // storage unavailable — fall through to ephemeral
  }
  const fresh = Crypto.randomUUID();
  try {
    await SecureStore.setItemAsync(APP_INSTANCE_KEY, fresh);
  } catch {
    // keep ephemeral
  }
  return fresh;
}

function getDeviceLabel(): string {
  const brand = Device.brand || "";
  const model = Device.modelName || Device.designName || "";
  return [brand, model].filter(Boolean).join(" ").trim();
}

// Cached per app launch — IDs don't change while running.
export function getPhoneIdentity(): Promise<PhoneIdentity> {
  if (!cached) {
    cached = (async () => {
      const [{ id, platform }, appInstanceId] = await Promise.all([
        getPlatformDeviceId(),
        getAppInstanceId(),
      ]);
      return { platformDeviceId: id, platform, appInstanceId, deviceLabel: getDeviceLabel() };
    })();
  }
  return cached;
}
