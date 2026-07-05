import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

import StepIndicator from "@/components/tracking/transfer-seller/StepIndicator";
import DeviceMiniCard from "@/components/tracking/transfer-seller/DeviceMiniCard";
import DeviceSummaryCard from "@/components/tracking/transfer-seller/DeviceSummaryCard";
import BuyerSection from "@/components/tracking/transfer-seller/BuyerSection";
import TransferFeeCard from "@/components/tracking/transfer-seller/TransferFeeCard";
import TransferButton from "@/components/tracking/transfer-seller/TransferButton";
import SuccessScreen from "@/components/tracking/transfer-seller/SuccessScreen";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const DEVICES = [
  { id: "sga54", name: "Samsung Galaxy A54", model: "SM-A546E · 128GB", imei: "358274 6829 ******", status: "Active", registered: "Jan 12, 2025", iconColor: "#1A56FF", iconBg: "#EEF3FF" },
  { id: "ip13", name: "iPhone 13 Pro", model: "A2638 · 256GB", imei: "012491 0036 ******", status: "Active", registered: "Mar 04, 2024", iconColor: "#7C3AED", iconBg: "#F3E8FF" },
  { id: "pix7", name: "Google Pixel 7", model: "GVU6C · 128GB", imei: "354987 2210 ******", status: "Active", registered: "Sep 22, 2024", iconColor: "#0EA5E9", iconBg: "#E0F2FE" },
];

export default function TransferSellerScreen() {
  const insets = useSafeAreaInsets();

  const [selectedId, setSelectedId] = useState("sga54");
  const [buyerInput, setBuyerInput] = useState("");
  const [buyerVerified, setBuyerVerified] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedDevice = useMemo(() => DEVICES.find((d) => d.id === selectedId) ?? DEVICES[0], [selectedId]);
  const step = (buyerVerified || buyerInput.length > 4) ? 2 : 1;
  const canSubmit = !!selectedDevice && buyerVerified;

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleInputChange = useCallback((v: string) => {
    setBuyerInput(v);
    setBuyerVerified(false);
  }, []);

  const handleScanQR = useCallback(() => {
    setBuyerInput("+234 801 234 5678");
    setTimeout(() => setBuyerVerified(true), 200);
  }, []);

  useEffect(() => {
    if (buyerVerified) return;
    const looksValid = buyerInput.includes("@") || buyerInput.replace(/\D/g, "").length >= 10;
    if (looksValid) {
      const t = setTimeout(() => setBuyerVerified(true), 900);
      return () => clearTimeout(t);
    }
  }, [buyerInput, buyerVerified]);

  const handleSubmit = useCallback(() => {
    if (!canSubmit || pressing) return;
    setPressing(true);
    setTimeout(() => {
      setPressing(false);
      setSubmitted(true);
    }, 900);
  }, [canSubmit, pressing]);

  const handleTrackTransfer = useCallback(() => {
    router.back();
  }, []);

  const handleBackToDevices = useCallback(() => {
    router.back();
  }, []);

  if (submitted) {
    return <SuccessScreen device={selectedDevice} onTrackTransfer={handleTrackTransfer} onBackToDevices={handleBackToDevices} />;
  }

  return (
    <View style={s.screen}>
      <View style={s.bgAccent} />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Transfer Ownership</Text>
        <View style={s.stepPill}>
          <Text style={s.stepPillText}>Step {step} of 2</Text>
        </View>
      </View>

      <View style={s.stepIndicatorWrap}>
        <StepIndicator step={step} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumText}>1</Text>
            </View>
            <Text style={s.sectionTitle}>Choose the device to transfer</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.deviceScroll}
            style={s.deviceScrollOuter}
          >
            {DEVICES.map((d) => (
              <DeviceMiniCard key={d.id} device={d} selected={selectedId === d.id} onSelect={handleSelectDevice} />
            ))}
          </ScrollView>

          {selectedDevice && <DeviceSummaryCard device={selectedDevice} />}
        </View>

        <View style={s.card}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionNum, step >= 2 && s.sectionNumActive]}>
              <Text style={[s.sectionNumText, step >= 2 && s.sectionNumTextActive]}>2</Text>
            </View>
            <Text style={s.sectionTitle}>Buyer Information</Text>
          </View>

          <BuyerSection
            buyerInput={buyerInput}
            buyerVerified={buyerVerified}
            onInputChange={handleInputChange}
            onScanQR={handleScanQR}
          />
        </View>

        <TransferFeeCard />

        <View style={s.footer}>
          <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke="#94A3B8" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
            <Path d="M8.5 12L11 14.5L15.5 9.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={s.footerText}>Protected by The Legit Owner · End-to-end verified</Text>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={[s.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TransferButton
          disabled={!canSubmit}
          pressing={pressing}
          showHelper={!canSubmit}
          helperText={!selectedDevice ? "Select a device to continue" : "Enter buyer details to continue"}
          onPress={handleSubmit}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  bgAccent: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#EEF3FF",
    opacity: 0.5,
    pointerEvents: "none",
    zIndex: 0,
  },
  topBar: {
    height: 56,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 14,
    flexShrink: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D0D0D",
    letterSpacing: -0.3,
  },
  stepPill: {
    height: 28,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  stepPillText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "white",
  },
  stepIndicatorWrap: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    zIndex: 10,
  },
  scroll: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sectionNumActive: {
    backgroundColor: "#1A56FF",
  },
  sectionNumText: {
    fontSize: 11,
    fontWeight: "700",
    color: "white",
  },
  sectionNumTextActive: {
    color: "white",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  deviceScrollOuter: {
    marginLeft: -18,
    marginRight: -18,
  },
  deviceScroll: {
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 4,
  },
  footerText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 20,
  },
});
