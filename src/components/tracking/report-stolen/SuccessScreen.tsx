import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Device } from "@/types/device";

function BigShieldCheck() {
  return (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" />
      <Circle cx="40" cy="40" r="28" fill="#16A34A" fillOpacity="0.12" />
      <Path d="M40 18L22 25V38C22 50 30 60.5 40 64C50 60.5 58 50 58 38V25L40 18Z" fill="#16A34A" fillOpacity="0.2" stroke="#16A34A" strokeWidth="2" strokeLinejoin="round" />
      <Path d="M30 40L37 47L52 32" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DeviceIcon({ color = "#DC2626", size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="18" r="1.3" fill={color} />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path d="M5 12L10 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  device: Device;
  onViewCase: () => void;
  onBackToTrack: () => void;
};

function SuccessScreen({ device, onViewCase, onBackToTrack }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const refNo = useRef("TLO-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const steps = [
    { step: "01", label: "Platform flagged", desc: "IMEI marked across all listings", done: true },
    { step: "02", label: "Police notified", desc: "Report forwarded to authorities", done: true },
    { step: "03", label: "Recovery tracking", desc: "You'll be notified if device surfaces", done: false },
  ];

  return (
    <View style={s.screen}>
      <LinearGradient colors={["#15803D", "#16A34A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <BigShieldCheck />
        </Animated.View>
        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle}>Report Submitted</Text>
          <Text style={s.headerSub}>Your device has been flagged as stolen{"\n"}across the Legit Owner platform.</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.refCard}>
          <View>
            <Text style={s.refLabel}>Reference Number</Text>
            <Text style={s.refValue}>{refNo.current}</Text>
          </View>
          <View style={s.activeBadge}>
            <Text style={s.activeText}>ACTIVE</Text>
          </View>
        </View>

        <View style={s.deviceCard}>
          <Text style={s.sectionLabel}>Flagged Device</Text>
          <View style={s.deviceRow}>
            <View style={s.deviceIconBox}>
              <DeviceIcon color="#DC2626" size={22} />
            </View>
            <View style={s.deviceInfo}>
              <Text style={s.deviceName}>{device.brand} {device.name}</Text>
              <Text style={s.deviceImei}>IMEI: {device.imei}</Text>
            </View>
            <View style={s.stolenBadge}>
              <View style={s.stolenDot} />
              <Text style={s.stolenLabel}>STOLEN</Text>
            </View>
          </View>
        </View>

        <View style={s.stepsCard}>
          <Text style={s.stepsTitle}>What happens next</Text>
          {steps.map((step, i) => (
            <View key={i} style={[s.stepRow, i < steps.length - 1 && s.stepRowGap]}>
              {i < steps.length - 1 && <View style={s.stepLine} />}
              <View style={[s.stepIcon, step.done ? s.stepIconDone : s.stepIconPending]}>
                {step.done ? <CheckIcon /> : <Text style={s.stepNum}>{step.step}</Text>}
              </View>
              <View style={s.stepTextWrap}>
                <Text style={s.stepLabel}>{step.label}</Text>
                <Text style={s.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={s.primaryCta} onPress={onViewCase}>
          <Text style={s.primaryCtaText}>View Case Status</Text>
        </Pressable>
        <Pressable style={s.secondaryCta} onPress={onBackToTrack}>
          <Text style={s.secondaryCtaText}>Back to Track Screen</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 16,
  },
  headerTextWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    lineHeight: 21,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  refCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
  },
  refValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: 0.5,
  },
  activeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },
  activeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  deviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  deviceImei: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  stolenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEF2F2",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  stolenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DC2626",
  },
  stolenLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },
  stepsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    position: "relative",
  },
  stepRowGap: {
    marginBottom: 14,
  },
  stepLine: {
    position: "absolute",
    left: 15,
    top: 30,
    width: 1,
    height: 22,
    backgroundColor: "#E2E8F0",
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepIconDone: {
    backgroundColor: "#16A34A",
  },
  stepIconPending: {
    backgroundColor: "#F1F5F9",
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  stepTextWrap: {
    paddingTop: 4,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  stepDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  primaryCta: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
  secondaryCta: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryCtaText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default memo(SuccessScreen);
