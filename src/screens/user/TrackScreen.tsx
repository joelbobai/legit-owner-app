import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { Device, DeviceStatus } from "@/types/device";
import { useDeviceTracker } from "@/hooks/useDeviceTracker";
import TrackingMap from "@/components/tracking/TrackingMap";
import DevicePill from "@/components/tracking/DevicePill";
import AlertToggle from "@/components/tracking/AlertToggle";
import PremiumHistoryCard from "@/components/tracking/PremiumHistoryCard";
import ReportStolenButton from "@/components/tracking/ReportStolenButton";
import StatusBadge from "@/components/tracking/StatusBadge";

const { width: SW } = Dimensions.get("window");

type ApiDevice = {
  _id: string;
  category: string;
  brand: string;
  model: string;
  status: string;
  identifiers?: { imei1?: string; imei2?: string; serialNumber?: string; deviceId?: string };
  condition?: string;
  color?: string;
  storage?: string;
  operatingSystem?: string;
  purchaseDate?: string;
  photos?: { url: string; type: string }[];
  registeredAt: string;
  updatedAt: string;
  lastKnownLocation?: { latitude: number; longitude: number; accuracy?: number };
  lastSeenAt?: string;
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: "Active", bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  stolen: { label: "Stolen", bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

function BellIcon() {
  return (
    <View style={s.bellWrap}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3C8.7 3 6 5.7 6 9V14L4 16H20L18 14V9C18 5.7 15.3 3 12 3Z" stroke="#1A56FF" strokeWidth="1.8" fill="none" />
        <Path d="M10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      </Svg>
      <View style={s.bellDot} />
    </View>
  );
}

function mapApiDevice(api: ApiDevice): Device {
  const date = new Date(api.registeredAt);
  const registeredDate = date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const lastSeen = api.lastSeenAt
    ? (() => {
        const diff = Date.now() - new Date(api.lastSeenAt!).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
        const days = Math.floor(hrs / 24);
        return `${days} day${days !== 1 ? "s" : ""} ago`;
      })()
    : "N/A";

  return {
    id: api._id,
    name: `${api.brand} ${api.model}`,
    brand: api.brand,
    category: api.category.charAt(0).toUpperCase() + api.category.slice(1),
    os: api.operatingSystem || "—",
    storage: api.storage || "—",
    color: api.color || "—",
    imei: api.identifiers?.imei1 || "—",
    serialNumber: api.identifiers?.serialNumber || "—",
    status: (api.status as DeviceStatus),
    registeredDate,
    purchaseDate: api.purchaseDate
      ? new Date(api.purchaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "—",
    condition: api.condition
      ? api.condition.replace("used_", "Used — ").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "—",
    ownerName: "",
    iconBg: "#F5F7FA",
    accentColor: api.status === "active" ? "#16A34A" : "#DC2626",
    lastKnownLocation: api.lastKnownLocation || undefined,
    lastSeen,
  };
}

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiDevices, setApiDevices] = useState<ApiDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [trackingOn, setTrackingOn] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/device`, {
          params: { status: "all" },
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = (res.data.devices || []) as ApiDevice[];
        const filtered = all.filter((d) => d.status === "active" || d.status === "stolen");
        setApiDevices(filtered);
        if (filtered.length > 0) setSelectedId(filtered[0]._id);
      } catch {
        setApiDevices([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const devices = useMemo(() => apiDevices.map(mapApiDevice), [apiDevices]);

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedId) ?? devices[0],
    [devices, selectedId],
  );

  const tracker = useDeviceTracker(token, devices, trackingOn);

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleReportStolen = useCallback(() => {
    router.push("/report-stolen");
  }, []);

  if (loading) {
    return (
      <View style={s.screen}>
        <View style={{ height: insets.top, backgroundColor: "white" }} />
        <ActivityIndicator size="large" color="#1A56FF" style={{ flex: 1 }} />
      </View>
    );
  }

  if (devices.length === 0) {
    return (
      <View style={s.screen}>
        <View style={{ height: insets.top, backgroundColor: "white" }} />
        <View style={s.emptyState}>
          <Text style={s.emptyTitle}>No devices to track</Text>
          <Text style={s.emptySub}>Register an active device to start tracking its location</Text>
        </View>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[selectedDevice?.status] || STATUS_CONFIG.active;
  const isTracking = tracker.isTracking;
  const matchedDevice = tracker.matchedDevice;
  const isLive = isTracking && matchedDevice?.id === selectedId;

  return (
    <View style={s.screen}>
      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <View style={s.topBarSide} />
        <Text style={s.topBarTitle}>Track My Device</Text>
        <View style={s.topBarSide}>
          <BellIcon />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={s.pillsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.pillsInner}
          >
            {devices.map((device) => (
              <DevicePill
                key={device.id}
                device={device}
                active={device.id === selectedId}
                onPress={() => handleSelectDevice(device.id)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={s.mapSection}>
          <TrackingMap
            devices={devices}
            selectedDeviceId={selectedId}
            liveLocation={isLive ? tracker.location : null}
            isLive={isLive}
            accuracy={tracker.accuracy}
            lastSeenText={selectedDevice?.lastSeen}
          />
        </View>

        <View style={s.floatingCard}>
          <View style={s.cardInner}>
            <View style={s.deviceRow}>
              <View style={s.deviceIconBox}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect x="6" y="2" width="12" height="20" rx="3" stroke="#1A56FF" strokeWidth="1.8" fill="none" />
                  <Circle cx="12" cy="18" r="1.3" fill="#1A56FF" />
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.deviceName}>
                  {selectedDevice?.brand} {selectedDevice?.name?.replace(`${selectedDevice?.brand} `, "")}
                </Text>
                <Text style={s.deviceLastSeen}>
                  {tracker.error
                    ? tracker.error
                    : isLive
                      ? `Live · ${tracker.accuracy ? `±${Math.round(tracker.accuracy)}m` : ""}`
                      : selectedDevice?.lastSeen ?? "N/A"}
                </Text>
              </View>
              <StatusBadge config={statusConfig} />
            </View>

            <View style={s.cardDivider} />

            <View style={s.alertsRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.alertsTitle}>Live Tracking</Text>
                <Text style={s.alertsDesc}>
                  {tracker.error
                    ? tracker.error
                    : trackingOn && matchedDevice
                      ? isLive
                        ? "Active · Background tracking on"
                        : `Matching ${matchedDevice.name}`
                      : "Enable to start sending GPS location"}
                </Text>
              </View>
              <AlertToggle value={trackingOn} onChange={() => setTrackingOn(!trackingOn)} />
            </View>
          </View>
        </View>

        <View style={s.sectionPad}>
          <PremiumHistoryCard />
        </View>

        <View style={s.sectionPad}>
          <ReportStolenButton onPress={handleReportStolen} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const MAP_H = 340;

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  topBar: {
    height: 56, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, flexShrink: 0,
  },
  topBarSide: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  topBarTitle: { fontSize: 18, fontWeight: "600", color: "#0D0D0D", letterSpacing: -0.3 },
  bellWrap: { position: "relative" },
  bellDot: {
    position: "absolute", top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4, backgroundColor: "#DC2626",
    borderWidth: 1.5, borderColor: "white",
  },
  scrollContent: { paddingBottom: 20 },
  pillsRow: { paddingTop: 14, paddingLeft: 20 },
  pillsInner: { gap: 8, paddingRight: 20 },
  mapSection: {
    height: MAP_H, marginTop: 14, marginHorizontal: 20, borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 32, elevation: 8,
  },
  floatingCard: { marginHorizontal: 20, marginTop: -20, zIndex: 10 },
  cardInner: {
    backgroundColor: "white", borderRadius: 20, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 32, elevation: 8,
  },
  deviceRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  deviceIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "#EEF3FF", alignItems: "center", justifyContent: "center",
  },
  deviceName: { fontSize: 15, fontWeight: "700", color: "#0D0D0D" },
  deviceLastSeen: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 14 },
  alertsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  alertsTitle: { fontSize: 14, fontWeight: "600", color: "#0D0D0D" },
  alertsDesc: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  sectionPad: { paddingHorizontal: 20, marginTop: 14 },
  emptyState: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#0D0D0D" },
  emptySub: { fontSize: 14, color: "#4A4A4A", textAlign: "center", marginTop: 8, maxWidth: 280 },
});
