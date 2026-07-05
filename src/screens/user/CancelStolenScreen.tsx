import { useCallback, useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { DEVICES } from "@/data/devices";
import ReportSummaryCard from "@/components/tracking/cancel-report/ReportSummaryCard";
import ReasonSelectionCard from "@/components/tracking/cancel-report/ReasonSelectionCard";
import FaceVerificationCard from "@/components/tracking/cancel-report/FaceVerificationCard";
import SubmitButton from "@/components/tracking/cancel-report/SubmitButton";
import SuccessScreen from "@/components/tracking/cancel-report/SuccessScreen";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DotPattern() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="390" height="844" opacity={0.3} pointerEvents="none">
      <Defs>
        <Pattern id="cd" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <Circle cx="1.5" cy="1.5" r="1.5" fill="#CBD5E1" />
        </Pattern>
      </Defs>
      <Rect width="390" height="844" fill="url(#cd)" />
    </Svg>
  );
}

export default function CancelStolenScreen() {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = reason !== null && faceVerified;

  const device = DEVICES[0];

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectReason = useCallback((id: string) => {
    setReason(id);
  }, []);

  const handleOtherTextChange = useCallback((text: string) => {
    setOtherText(text);
  }, []);

  const handleStartFaceScan = useCallback(() => {
    if (faceVerified || faceScanning) return;
    setFaceScanning(true);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceVerified(true);
    }, 2000);
  }, [faceVerified, faceScanning]);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    Keyboard.dismiss();
    setSubmitted(true);
  }, [isValid]);

  const handleViewDevice = useCallback(() => {
    router.back();
  }, []);

  const handleBackToTrack = useCallback(() => {
    router.back();
  }, []);

  if (submitted) {
    return <SuccessScreen device={device} onViewDevice={handleViewDevice} onBackToTrack={handleBackToTrack} />;
  }

  return (
    <View style={s.screen}>
      <DotPattern />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Cancel Stolen Report</Text>
        <View style={s.spacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ReportSummaryCard device={device} />
        <ReasonSelectionCard
          selectedId={reason}
          onSelect={handleSelectReason}
          otherText={otherText}
          onOtherTextChange={handleOtherTextChange}
        />
        <FaceVerificationCard
          scanning={faceScanning}
          verified={faceVerified}
          onStartScan={handleStartFaceScan}
        />
        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={[s.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <SubmitButton disabled={!isValid} onPress={handleSubmit} />
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
    paddingRight: 20,
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
  spacer: {
    width: 44,
  },
  scroll: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    zIndex: 20,
  },
});
