import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import ActionButtons from "@/components/tracking/transfer-buyer/ActionButtons";
import DeviceHistoryCard from "@/components/tracking/transfer-buyer/DeviceHistoryCard";
import type { DeviceData } from "@/components/tracking/transfer-buyer/DeviceInfoCard";
import DeviceInfoCard from "@/components/tracking/transfer-buyer/DeviceInfoCard";
import SuccessOverlay from "@/components/tracking/transfer-buyer/SuccessOverlay";
import TransferNotificationBanner from "@/components/tracking/transfer-buyer/TransferNotificationBanner";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M5 12L11 18M5 12L11 6"
        stroke="#0D0D0D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const DEVICE_DATA: DeviceData = {
  id: "sga54",
  name: "Samsung Galaxy A54",
  brand: "Samsung",
  storage: "128GB",
  color: "Midnight Black",
  os: "Android 14",
  imei: "358274 6829 145 632",
  condition: "Used — Good",
  verified: true,
  registeredDate: "Jan 12, 2025",
  sellerName: "Adaeze Okoro",
  sellerInitials: "AO",
  sellerVerified: true,
  trustScore: 4,
};

export default function TransferBuyerScreen() {
  const insets = useSafeAreaInsets();

  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleAccept = useCallback(() => {
    if (acceptLoading) return;
    setAcceptLoading(true);
    router.push("/(user)/transfer-complete" as any);
    setTimeout(() => {
      setAcceptLoading(false);
      setAcceptSuccess(true);
    }, 900);
  }, [acceptLoading]);

  const handleReject = useCallback(() => {
    if (rejectLoading) return;
    setRejectLoading(true);
    setTimeout(() => {
      setRejectLoading(false);
      setRejectSuccess(true);
    }, 900);
  }, [rejectLoading]);

  const handleViewDevice = useCallback(() => {
    router.back();
  }, []);

  const handleBackHome = useCallback(() => {
    router.back();
  }, []);

  if (acceptSuccess) {
    return (
      <SuccessOverlay
        kind="accept"
        device={DEVICE_DATA}
        onViewDevice={handleViewDevice}
        onBackHome={handleBackHome}
      />
    );
  }

  if (rejectSuccess) {
    return (
      <SuccessOverlay
        kind="reject"
        device={DEVICE_DATA}
        onViewDevice={handleViewDevice}
        onBackHome={handleBackHome}
      />
    );
  }

  return (
    <View style={s.screen}>
      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Transfer Request</Text>
        <View style={s.topBarSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TransferNotificationBanner sellerName={DEVICE_DATA.sellerName} />

        <DeviceInfoCard device={DEVICE_DATA} />

        <DeviceHistoryCard />

        <View style={s.footer}>
          <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z"
              stroke="#94A3B8"
              strokeWidth="1.8"
              fill="none"
              strokeLinejoin="round"
            />
            <Path
              d="M8.5 12L11 14.5L15.5 9.5"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={s.footerText}>
            Protected by The Legit Owner · End-to-end verified
          </Text>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View
        style={[s.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <ActionButtons
          onAccept={handleAccept}
          onReject={handleReject}
          acceptLoading={acceptLoading}
          rejectLoading={rejectLoading}
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
  topBarSpacer: {
    width: 44,
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
