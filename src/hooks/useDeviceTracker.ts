import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import * as Device from "expo-device";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";
import { Device as DeviceType } from "@/types/device";

const BG_TASK = "device-location-task";

type TrackingState = {
  isTracking: boolean;
  matchedDevice: DeviceType | null;
  location: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  error: string | null;
};

TaskManager.defineTask(BG_TASK, async ({ data, error }) => {
  if (error || !data) return;
  const { locations } = data as any;
  if (!locations?.length) return;

  try {
    const { latitude, longitude } = locations[0].coords;
    const accuracy = locations[0].coords.accuracy;
    const token = await SecureStore.getItemAsync("bg_track_token");
    const deviceId = await SecureStore.getItemAsync("bg_track_device_id");
    if (token && deviceId) {
      await axios.post(
        `${API_BASE_URL}/device/${deviceId}/location`,
        { latitude, longitude, accuracy },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
  } catch {}
});

async function requestPermissions(): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") return false;
  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.status === "granted";
}

export function useDeviceTracker(
  token: string | null,
  registeredDevices: DeviceType[],
  enabled: boolean,
): TrackingState {
  const [state, setState] = useState<TrackingState>({
    isTracking: false,
    matchedDevice: null,
    location: null,
    accuracy: null,
    error: null,
  });
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!enabled || !token || registeredDevices.length === 0) {
      if (watchRef.current) { watchRef.current.remove(); watchRef.current = null; }
      TaskManager.isTaskRegisteredAsync(BG_TASK).then((r) => { if (r) Location.stopLocationUpdatesAsync(BG_TASK); });
      setState((prev) => ({ ...prev, isTracking: false, error: null }));
      return;
    }

    (async () => {
      try {
        const deviceBrand = Device.brand;
        const deviceModel = Device.modelName;
        if (!deviceBrand || !deviceModel) {
          setState((p) => ({ ...p, isTracking: false, error: "Could not identify this device" }));
          return;
        }

        const match = registeredDevices.find(
          (d) =>
            d.brand.toLowerCase() === deviceBrand.toLowerCase() &&
            d.name.toLowerCase().includes(deviceModel.toLowerCase()),
        );
        if (!match) {
          setState((p) => ({ ...p, isTracking: false, error: `No registered device matches this ${deviceBrand} ${deviceModel}` }));
          return;
        }

        const perms = await requestPermissions();
        if (!perms) {
          setState((p) => ({ ...p, isTracking: false, error: "Location permission denied" }));
          return;
        }

        setState((p) => ({ ...p, matchedDevice: match, error: null }));

        await SecureStore.setItemAsync("bg_track_token", token);
        await SecureStore.setItemAsync("bg_track_device_id", match.id);

        await Location.startLocationUpdatesAsync(BG_TASK, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 5,
          foregroundService: {
            notificationTitle: "Device Tracking",
            notificationBody: "Sending location for your device",
          },
        });

        watchRef.current = await Location.watchPositionAsync(
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
              { headers: { Authorization: `Bearer ${token}` } },
            ).catch(() => {});
          },
        );
      } catch (err: any) {
        if (mountedRef.current) {
          setState((p) => ({ ...p, isTracking: false, error: err?.message || "Failed to start tracking" }));
        }
      }
    })();

    return () => {
      mountedRef.current = false;
      if (watchRef.current) { watchRef.current.remove(); watchRef.current = null; }
      TaskManager.isTaskRegisteredAsync(BG_TASK).then((r) => { if (r) Location.stopLocationUpdatesAsync(BG_TASK); });
    };
  }, [enabled, token, registeredDevices]);

  return state;
}
