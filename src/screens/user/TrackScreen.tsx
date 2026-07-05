import { useCallback, useMemo, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { DEVICES } from "@/data/devices";
import TrackingMap from "@/components/tracking/TrackingMap";
import DevicePill from "@/components/tracking/DevicePill";
import AlertToggle from "@/components/tracking/AlertToggle";
import PremiumHistoryCard from "@/components/tracking/PremiumHistoryCard";
import ReportStolenButton from "@/components/tracking/ReportStolenButton";
import StatusBadge from "@/components/tracking/StatusBadge";
import { STATUS_CONFIG } from "@/data/devices";

const { width: SW } = Dimensions.get("window");

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

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

function DeviceIconSmall() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke="#1A56FF" strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="18" r="1.3" fill="#1A56FF" />
    </Svg>
  );
}

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string>(DEVICES[0]?.id ?? "");
  const [alertsOn, setAlertsOn] = useState(true);

  const devices = DEVICES;

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedId) ?? devices[0],
    [devices, selectedId]
  );

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleReportStolen = useCallback(() => {
    router.push("/report-stolen");
  }, []);

  const statusConfig = STATUS_CONFIG[selectedDevice.status];
  const isOnline = selectedDevice.status === "active";

  return (
    <View style={s.screen}>
      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <View style={s.topBarSide}>
          <ArrowLeftIcon />
        </View>
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
          />
        </View>

        <View style={s.floatingCard}>
          <View style={s.cardInner}>
            <View style={s.deviceRow}>
              <View style={s.deviceIconBox}>
                <DeviceIconSmall />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.deviceName}>
                  {selectedDevice.brand} {selectedDevice.name}
                </Text>
                <Text style={s.deviceLastSeen}>
                  {selectedDevice.lastSeen ?? "N/A"} · Abuja
                </Text>
              </View>
              <StatusBadge config={statusConfig} />
            </View>

            <View style={s.cardDivider} />

            <View style={s.alertsRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.alertsTitle}>Location Alerts</Text>
                <Text style={s.alertsDesc}>
                  {alertsOn
                    ? "You'll be notified of unusual movement"
                    : "Alerts are currently off"}
                </Text>
              </View>
              <AlertToggle value={alertsOn} onChange={() => setAlertsOn(!alertsOn)} />
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
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  topBar: {
    height: 56,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    flexShrink: 0,
  },
  topBarSide: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D0D0D",
    letterSpacing: -0.3,
  },
  bellWrap: {
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DC2626",
    borderWidth: 1.5,
    borderColor: "white",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  pillsRow: {
    paddingTop: 14,
    paddingLeft: 20,
  },
  pillsInner: {
    gap: 8,
    paddingRight: 20,
  },
  mapSection: {
    height: MAP_H,
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  floatingCard: {
    marginHorizontal: 20,
    marginTop: -20,
    zIndex: 10,
  },
  cardInner: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deviceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  deviceLastSeen: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  alertsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  alertsDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  sectionPad: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
});
