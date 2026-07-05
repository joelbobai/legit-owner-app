import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { AppBar, StepBadge } from "@/components/AppBar";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import IMEIInputCard from "@/components/register-device/IMEIInputCard";
import VerificationCard from "@/components/register-device/VerificationCard";
import Tooltip from "@/components/register-device/Tooltip";
import OCRActionButtons from "@/components/register-device/OCRActionButtons";

import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

type VerifyState = "idle" | "loading" | "valid" | "invalid" | "stolen";

export default function Step2IMeiScreen() {
  const insets = useSafeAreaInsets();
  const { data, setImei, updateDetails } = useDeviceRegistration();
  const [digits, setDigits] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [showTooltip, setShowTooltip] = useState(false);

  const isComplete = digits.length === 15;
  const isReady = verifyState === "valid";

  const handleVerify = useCallback(() => {
    if (!isComplete) return;
    setVerifyState("loading");
    setTimeout(() => {
      if (digits === "000000000000000") {
        setVerifyState("invalid");
      } else if (digits === "111111111111111") {
        setVerifyState("stolen");
      } else {
        setVerifyState("valid");
        if (data.brand !== "Samsung" || data.model !== "Galaxy A54") {
          updateDetails({ brand: "Samsung", model: "Galaxy A54" });
        }
      }
    }, 1400);
  }, [digits, isComplete, data.brand, data.model, updateDetails]);

  const handleDigitsChange = useCallback((d: string) => {
    setDigits(d);
    setVerifyState("idle");
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleNext = useCallback(() => {
    if (isReady) {
      setImei(digits);
      router.push("/(user)/register-device/step3" as any);
    }
  }, [isReady, digits, setImei]);

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
            id="s2Dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width="390" height="844" fill="url(#s2Dots)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <AppBar
        title="Register a Device"
        onBack={handleBack}
        right={<StepBadge label="2 of 4" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressHeader current={2} total={4} />

        <View style={s.body}>
          <Text style={s.heading}>Enter Device IMEI</Text>
          <View style={s.infoRow}>
            <Text style={s.subheading}>
              Dial <Text style={s.bold}>*#06#</Text> on your phone to see your
              IMEI
            </Text>
            <Pressable
              hitSlop={8}
              onPress={() => setShowTooltip((p) => !p)}
              style={s.infoIcon}
            >
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Circle cx="8" cy="8" r="6.5" stroke="#1A56FF" strokeWidth="1.3" />
                <Path d="M8 7V11" stroke="#1A56FF" strokeWidth="1.4" strokeLinecap="round" />
                <Circle cx="8" cy="5" r="0.8" fill="#1A56FF" />
              </Svg>
            </Pressable>
            <Tooltip visible={showTooltip} />
          </View>
        </View>

        <View style={s.inputSection}>
          <IMEIInputCard
            digits={digits}
            onChangeDigits={handleDigitsChange}
            verifyState={verifyState}
            onVerify={handleVerify}
          />

          {(verifyState === "valid" ||
            verifyState === "invalid" ||
            verifyState === "stolen") && (
            <VerificationCard state={verifyState} />
          )}

          <OCRActionButtons />
        </View>
      </ScrollView>

      <View style={s.bottomArea}>
        <ExpoLinearGradient
          colors={["transparent", "#F5F7FA"]}
          style={s.bottomGradient}
          pointerEvents="none"
        />
        <View style={s.bottomContent}>
          <Pressable
            style={[s.nextBtn, !isReady && s.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!isReady}
          >
            <ExpoLinearGradient
              colors={
                isReady ? ["#1A56FF", "#0A2ECC"] : ["#CBD5E1", "#CBD5E1"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.nextBtnGrad}
            >
              <Text style={s.nextBtnText}>Continue to Device Details</Text>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ExpoLinearGradient>
          </Pressable>
        </View>
      </View>
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
  scrollContent: { paddingBottom: 220 },

  body: { paddingHorizontal: 20, paddingTop: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    position: "relative",
  },
  subheading: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 21,
    flex: 1,
  },
  bold: { fontWeight: "700", color: "#0D0D0D" },
  infoIcon: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  inputSection: { paddingHorizontal: 20, paddingTop: 20 },

  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomGradient: { height: 40 },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#F5F7FA",
  },
  nextBtn: {
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  nextBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  nextBtnGrad: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
});
