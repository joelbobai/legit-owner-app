import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";
import { Device as DeviceType } from "@/types/device";
import { getPhoneIdentity } from "@/utils/deviceIdentity";

export const BG_TASK = "device-location-task";
const BG_TOKEN_KEY = "bg_track_token";
const BG_DEVICE_KEY = "bg_track_device_id";

type TrackingState = {
  isTracking: boolean;
  matchedDevice: DeviceType | null;
  location: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  error: string | null;
  needsPermissionPrompt: boolean;
};

TaskManager.defineTask(BG_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const { locations } = data as any;
  if (!locations?.length) return;

  try {
    const { latitude, longitude } = locations[0].coords;
    const accuracy = locations[0].coords.accuracy;
    const token = await SecureStore.getItemAsync(BG_TOKEN_KEY);
    const deviceId = await SecureStore.getItemAsync(BG_DEVICE_KEY);
    if (token && deviceId) {
      await axios.post(
        `${API_BASE_URL}/device/${deviceId}/location`,
        { latitude, longitude, accuracy },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  } catch {}
});

// Full stop for logout: kill the background task and forget its credentials
// so a signed-out phone never keeps reporting.
export async function stopTrackingCompletely() {
  try {
    if (await TaskManager.isTaskRegisteredAsync(BG_TASK)) {
      await Location.stopLocationUpdatesAsync(BG_TASK);
    }
  } catch {}
  try {
    await SecureStore.deleteItemAsync(BG_TOKEN_KEY);
    await SecureStore.deleteItemAsync(BG_DEVICE_KEY);
  } catch {}
}

async function startBgTask() {
  try {
    if (await TaskManager.isTaskRegisteredAsync(BG_TASK)) return;
    await Location.startLocationUpdatesAsync(BG_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 5,
      foregroundService: {
        notificationTitle: "Device Tracking",
        notificationBody: "Sending location for your device",
      },
    });
  } catch {}
}

async function stopBgTask() {
  try {
    if (await TaskManager.isTaskRegisteredAsync(BG_TASK)) {
      await Location.stopLocationUpdatesAsync(BG_TASK);
    }
  } catch {}
}

export function useDeviceTracker(
  token: string | null,
  registeredDevices: DeviceType[],
  enabled: boolean,
): TrackingState & { primeTracking: () => void } {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    matchedDevice: null,
    location: null,
    accuracy: null,
    error: null,
    needsPermissionPrompt: false,
  });
  const fgWatchRef = useRef<Location.LocationSubscription | null>(null);
  const mountedRef = useRef(true);
  const runRef = useRef(0);
  const liveRef = useRef({ token: null as string | null, match: null as DeviceType | null });

  const stopFg = useCallback(() => {
    if (fgWatchRef.current) {
      fgWatchRef.current.remove();
      fgWatchRef.current = null;
    }
  }, []);

  const startFg = useCallback(() => {
    const { token: t, match } = liveRef.current;
    if (!t || !match || fgWatchRef.current) return;
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 2 },
      (loc) => {
        if (!mountedRef.current) return;
        const { latitude, longitude } = loc.coords;
        const accuracy = loc.coords.accuracy ?? null;
        setState((p) => ({
          ...p,
          isTracking: true,
          location: { latitude, longitude },
          accuracy,
          error: null,
        }));
        axios.post(
          `${API_BASE_URL}/device/${match.id}/location`,
          { latitude, longitude, accuracy },
          { headers: { Authorization: `Bearer ${t}` } },
        ).catch(() => {});
      },
    ).then(
      (sub) => {
        fgWatchRef.current = sub;
      },
      () => {
        if (mountedRef.current) {
          setState((p) => ({ ...p, isTracking: false, error: "Failed to start live tracking" }));
        }
      },
    );
  }, []);

  // Match THIS physical phone by hardware ID — never by brand/model name,
  // which can't tell identical phones apart.
  const resolveMatch = useCallback(
    async (activeToken: string): Promise<DeviceType> => {
      const id = await getPhoneIdentity().catch(() => null);
      if (!id?.platformDeviceId && !id?.appInstanceId) {
        throw new Error("Could not identify this phone");
      }
      const res = await axios.get(`${API_BASE_URL}/device/current`, {
        params: {
          platformDeviceId: id?.platformDeviceId || undefined,
          appInstanceId: id?.appInstanceId || undefined,
        },
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const bound = res.data?.device;
      if (!bound) {
        throw new Error("This phone isn't linked to any of your devices — link it from Home first");
      }
      const full = registeredDevices.find((d) => d.id === String(bound._id));
      if (!full) {
        throw new Error("This phone is linked to a device that isn't available for tracking");
      }
      return full;
    },
    [registeredDevices],
  );

  const boot = useCallback(
    async (requestPerms: boolean) => {
      const run = ++runRef.current;
      const t = liveRef.current.token;
      if (!t) return;
      try {
        const match = await resolveMatch(t);
        if (run !== runRef.current || !mountedRef.current) return;

        // Check current permission state WITHOUT prompting first
        const fg = await Location.getForegroundPermissionsAsync();
        if (fg.status !== "granted") {
          if (!requestPerms) {
            setState((p) => ({ ...p, needsPermissionPrompt: true, error: null }));
            return;
          }
          const req = await Location.requestForegroundPermissionsAsync();
          if (req.status !== "granted") {
            if (run === runRef.current && mountedRef.current) {
              setState((p) => ({ ...p, isTracking: false, error: "Location permission denied" }));
            }
            return;
          }
        }
        // Background (for closed-app updates) — request once, tolerate denial
        try {
          const bg = await Location.getBackgroundPermissionsAsync();
          if (bg.status !== "granted") {
            await Location.requestBackgroundPermissionsAsync();
          }
        } catch {}

        if (run !== runRef.current || !mountedRef.current) return;
        liveRef.current.match = match;

        await SecureStore.setItemAsync(BG_TOKEN_KEY, t);
        await SecureStore.setItemAsync(BG_DEVICE_KEY, match.id);

        setState((p) => ({ ...p, matchedDevice: match, needsPermissionPrompt: false, error: null }));

        // Foreground watch only while the app is open; background task only
        // while it's closed — never both (battery).
        if (AppState.currentState === "active") {
          await stopBgTask();
          startFg();
        } else {
          stopFg();
          await startBgTask();
        }
      } catch (err: any) {
        if (run === runRef.current && mountedRef.current) {
          setState((p) => ({
            ...p,
            isTracking: false,
            needsPermissionPrompt: false,
            error: err?.response?.data?.message || err?.message || "Failed to start tracking",
          }));
        }
      }
    },
    [resolveMatch, startFg, stopFg],
  );

  const primeTracking = useCallback(() => {
    setState((p) => ({ ...p, needsPermissionPrompt: false }));
    boot(true);
  }, [boot]);

  useEffect(() => {
    mountedRef.current = true;
    liveRef.current.token = token;

    if (!enabled || !token || registeredDevices.length === 0) {
      runRef.current++;
      stopFg();
      stopBgTask();
      SecureStore.deleteItemAsync(BG_TOKEN_KEY).catch(() => {});
      SecureStore.deleteItemAsync(BG_DEVICE_KEY).catch(() => {});
      liveRef.current.match = null;
      setState((prev) => ({
        ...prev,
        isTracking: false,
        matchedDevice: null,
        needsPermissionPrompt: false,
        error: null,
      }));
      return;
    }

    boot(false);

    // Switch GPS source with app visibility — never double-post
    const sub = AppState.addEventListener("change", (next) => {
      if (!mountedRef.current || !liveRef.current.match) return;
      if (next === "active") {
        stopBgTask();
        startFg();
      } else {
        stopFg();
        startBgTask();
      }
    });

    return () => {
      mountedRef.current = false;
      runRef.current++;
      sub.remove();
      stopFg();
      stopBgTask();
    };
  }, [enabled, token, registeredDevices, boot, stopFg]);

  return { ...state, primeTracking };
}
