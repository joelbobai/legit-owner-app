import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
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

function DualImeiToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={di.toggle}>
      <View style={[di.checkbox, enabled && di.checkboxActive]}>
        {enabled && (
          <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={di.title}>This device has 2 IMEI numbers</Text>
        <Text style={di.sub}>
          Dual-SIM phones have a second IMEI for the other SIM slot
        </Text>
      </View>
    </Pressable>
  );
}

const di = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#1A56FF",
    borderColor: "#1A56FF",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  sub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});

export default function Step2IMeiScreen() {
  const insets = useSafeAreaInsets();
  const { data, setImei, setImei2, updateDetails } = useDeviceRegistration();

  const [digits1, setDigits1] = useState("");
  const [verifyState1, setVerifyState1] = useState<VerifyState>("idle");

  const [hasDualImei, setHasDualImei] = useState(false);
  const [digits2, setDigits2] = useState("");
  const [verifyState2, setVerifyState2] = useState<VerifyState>("idle");

  const [showTooltip, setShowTooltip] = useState(false);

  const imei1Complete = digits1.length === 15;
  const imei2Complete = digits2.length === 15;
  const isReady = hasDualImei
    ? verifyState1 === "valid" && verifyState2 === "valid"
    : verifyState1 === "valid";

  const runVerify = useCallback(
    (digits: string, setState: (s: VerifyState) => void) => {
      setState("loading");
      setTimeout(() => {
        if (digits === "000000000000000") {
          setState("invalid");
        } else if (digits === "111111111111111") {
          setState("stolen");
        } else {
          setState("valid");
        }
      }, 1400);
    },
    [],
  );

  const handleVerify1 = useCallback(() => {
    if (!imei1Complete) return;
    runVerify(digits1, setVerifyState1);
    if (data.brand !== "Samsung" || data.model !== "Galaxy A54") {
      updateDetails({ brand: "Samsung", model: "Galaxy A54" });
    }
  }, [digits1, imei1Complete, data.brand, data.model, runVerify, updateDetails]);

  const handleVerify2 = useCallback(() => {
    if (!imei2Complete) return;
    runVerify(digits2, setVerifyState2);
  }, [digits2, imei2Complete, runVerify]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleNext = useCallback(() => {
    if (!isReady) return;
    setImei(digits1);
    if (hasDualImei) setImei2(digits2);
    router.push("/(user)/register-device/step3" as any);
  }, [isReady, digits1, digits2, hasDualImei, setImei, setImei2]);

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
            digits={digits1}
            onChangeDigits={(d) => { setDigits1(d); setVerifyState1("idle"); }}
            verifyState={verifyState1}
            onVerify={handleVerify1}
          />

          {(verifyState1 === "valid" ||
            verifyState1 === "invalid" ||
            verifyState1 === "stolen") && (
            <VerificationCard state={verifyState1} />
          )}

          <DualImeiToggle
            enabled={hasDualImei}
            onToggle={() => setHasDualImei((p) => !p)}
          />

          {hasDualImei && (
            <View style={{ marginTop: 12 }}>
              <Text style={s.imei2Label}>IMEI 2 (second SIM slot)</Text>
              <IMEIInputCard
                digits={digits2}
                onChangeDigits={(d) => { setDigits2(d); setVerifyState2("idle"); }}
                verifyState={verifyState2}
                onVerify={handleVerify2}
              />

              {(verifyState2 === "valid" ||
                verifyState2 === "invalid" ||
                verifyState2 === "stolen") && (
                <VerificationCard state={verifyState2} />
              )}
            </View>
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
  imei2Label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },

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
