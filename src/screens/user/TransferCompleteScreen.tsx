import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ActionButtons from "@/components/tracking/transfer-complete/ActionButtons";
import CertificateCard from "@/components/tracking/transfer-complete/CertificateCard";
import FloatingParticles from "@/components/tracking/transfer-complete/FloatingParticles";
import ResponsibilityTransferCard from "@/components/tracking/transfer-complete/ResponsibilityTransferCard";
import ShareActions from "@/components/tracking/transfer-complete/ShareActions";
import SuccessHero from "@/components/tracking/transfer-complete/SuccessHero";

const DEVICE = {
  name: "Galaxy A54 5G",
  brand: "Samsung",
  storage: "128 GB",
  imei: "3582746829******",
  registeredDate: "Apr 27, 2025",
  ownerName: "Adaeze Okoro",
};

export default function TransferCompleteScreen() {
  const insets = useSafeAreaInsets();

  const handleViewDevice = useCallback(() => {
    router.back();
  }, []);

  const handleViewHistory = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={s.screen}>
      <FloatingParticles />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 30) + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <SuccessHero deviceName={`Samsung ${DEVICE.name}`} imei={DEVICE.imei} />

        <CertificateCard device={DEVICE} />

        <ResponsibilityTransferCard sellerName="Chukwuemeka Okoro" />

        <ShareActions />

        <ActionButtons
          onViewDevice={handleViewDevice}
          onViewHistory={handleViewHistory}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  statusBar: {
    height: 54,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 24,
    backgroundColor: "white",
    position: "relative",
    zIndex: 10,
  },
  time: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    letterSpacing: -0.2,
  },
  dynamicIsland: {
    position: "absolute",
    top: 12,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 34,
    backgroundColor: "#000",
    borderRadius: 20,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconText: {
    fontSize: 12,
    color: "#0D0D0D",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
  },
  bar: {
    width: 3,
    backgroundColor: "#0D0D0D",
    borderRadius: 1,
  },
  scroll: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});
