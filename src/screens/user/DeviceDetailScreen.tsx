import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import ActionButton from "@/components/device/ActionButton";
import DeviceHero from "@/components/device/DeviceHero";
import DeviceHistoryPreview from "@/components/device/DeviceHistoryPreview";
import {
  ArrowLeft,
  ArrowsLeftRight,
  Certificate,
  Clock,
  MapPin,
  Pencil,
  Share,
  ShieldWarning,
} from "@/components/device/DeviceIcons";
import DeviceInfoCard from "@/components/device/DeviceInfoCard";
import QrCertificateCard from "@/components/device/QrCertificateCard";
import Toast from "@/components/device/Toast";
import { ArrowRightIcon } from "@/components/Icon";
import { DEVICES, STATUS_CONFIG } from "@/data/devices";

export default function DeviceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const device = useMemo(() => DEVICES.find((d) => d.id === id), [id]);
  const statusConfig = device
    ? STATUS_CONFIG[device.status]
    : STATUS_CONFIG.active;

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const handleBack = useCallback(() => router.back(), []);
  const handleCopyImei = useCallback(
    () => showToast("IMEI copied to clipboard"),
    [showToast],
  );
  const handleViewPdf = useCallback(
    () => showToast("Certificate downloaded"),
    [showToast],
  );
  const handleViewHistory = useCallback(
    () => showToast("Full history coming soon"),
    [showToast],
  );
  const handleTrack = useCallback(
    () => showToast("Track device feature coming soon"),
    [showToast],
  );
  const handleReportStolen = useCallback(
    () => showToast("Report stolen feature coming soon"),
    [showToast],
  );
  const handleTransfer = useCallback(() => {
    router.push("/(user)/transfer-seller" as any);
    // showToast("Transfer ownership feature coming soon")
  }, [showToast]);
  const handleEdit = useCallback(
    () => showToast("Edit device feature coming soon"),
    [showToast],
  );
  const handleViewHistoryAction = useCallback(
    () => showToast("Full history coming soon"),
    [showToast],
  );

  if (!device) {
    return (
      <View style={[s.screen, { paddingTop: insets.top }]}>
        <View style={s.notFound}>
          <Text style={s.notFoundText}>Device not found</Text>
          <Pressable style={s.backBtn} onPress={handleBack}>
            <ArrowRightIcon size={20} color="white" />
            <Text style={s.backBtnText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <Svg
        width="390"
        height="844"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="ddDots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width="390" height="844" fill="url(#ddDots)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable style={s.topBarBack} onPress={handleBack}>
          <ArrowLeft size={22} color="#0D0D0D" />
        </Pressable>
        <Text style={s.topBarTitle} numberOfLines={1}>
          {device.name}
        </Text>
        <View style={s.topBarShare}>
          <Share size={18} color="#1A56FF" />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.body}>
          <DeviceHero
            device={device}
            statusConfig={statusConfig}
            onBack={handleBack}
          />

          <View style={s.sectionGap}>
            <DeviceInfoCard device={device} onCopyImei={handleCopyImei} />
          </View>

          <View style={s.sectionGap}>
            <Text style={s.sectionLabel}>QUICK ACTIONS</Text>
            <View style={s.actionsGrid}>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<MapPin size={22} color="#F59E0B" />}
                  label="Track Device"
                  bgColor="#FEF9EE"
                  onPress={handleTrack}
                />
              </View>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<ShieldWarning size={22} color="#DC2626" />}
                  label="Report Stolen"
                  bgColor="#FEF2F2"
                  onPress={handleReportStolen}
                />
              </View>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<ArrowsLeftRight size={22} color="#1A56FF" />}
                  label="Transfer Ownership"
                  bgColor="#EEF3FF"
                  onPress={handleTransfer}
                />
              </View>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<Certificate size={22} color="#16A34A" />}
                  label="Download Certificate"
                  bgColor="#F0FDF4"
                  onPress={handleViewPdf}
                />
              </View>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<Pencil size={22} color="#1A56FF" />}
                  label="Edit Device Info"
                  bgColor="#EEF3FF"
                  onPress={handleEdit}
                />
              </View>
              <View style={s.actionItemWrapper}>
                <ActionButton
                  icon={<Clock size={22} color="#64748B" />}
                  label="View Full History"
                  bgColor="#F8FAFC"
                  onPress={handleViewHistoryAction}
                />
              </View>
            </View>
          </View>

          <View style={s.sectionGap}>
            <QrCertificateCard onViewPdf={handleViewPdf} />
          </View>

          <View style={s.sectionGapLast}>
            <DeviceHistoryPreview onPress={handleViewHistory} />
          </View>
        </View>
      </ScrollView>

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  blobTR: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EEF3FF",
    opacity: 0.35,
  },
  scrollContent: { paddingBottom: 24 },

  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundText: { fontSize: 16, color: "#4A4A4A" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1A56FF",
    borderRadius: 12,
  },
  backBtnText: { color: "white", fontWeight: "600", fontSize: 14 },

  topBar: {
    height: 56,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 16,
    flexShrink: 0,
  },
  topBarBack: {
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
    flex: 1,
    textAlign: "center",
  },
  topBarShare: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  body: { padding: 20 },

  sectionGap: { marginTop: 20 },
  sectionGapLast: { marginTop: 16, marginBottom: 60 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 12,
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionItemWrapper: {
    width: "31%",
  },
});
