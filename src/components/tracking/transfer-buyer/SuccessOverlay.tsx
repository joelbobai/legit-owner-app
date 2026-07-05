import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import AnimatedReanimated, { useSharedValue, useAnimatedProps, withSpring, withDelay } from "react-native-reanimated";
import { DeviceData } from "./DeviceInfoCard";

const AnimatedCircle = AnimatedReanimated.createAnimatedComponent(Circle);
const AnimatedPath = AnimatedReanimated.createAnimatedComponent(Path);

function CheckmarkIcon() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }));
  }, [progress]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: 282.7 - 282.7 * progress.value,
  }));

  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: 40 - 40 * progress.value,
  }));

  return (
    <Svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <AnimatedCircle
        cx="44"
        cy="44"
        r="42"
        stroke="#93C5FD"
        strokeWidth="3"
        strokeDasharray={282.7}
        animatedProps={circleProps}
        fill="none"
      />
      <Circle cx="44" cy="44" r="30" fill="#16A34A" fillOpacity="0.15" />
      <AnimatedPath
        d="M28 45L38 55L60 33"
        stroke="#16A34A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={40}
        animatedProps={pathProps}
      />
    </Svg>
  );
}

function XMarkIcon() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }));
  }, [progress]);

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: 282.7 - 282.7 * progress.value,
  }));

  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: 36 - 36 * progress.value,
  }));

  return (
    <Svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <AnimatedCircle
        cx="44"
        cy="44"
        r="42"
        stroke="#FECACA"
        strokeWidth="3"
        strokeDasharray={282.7}
        animatedProps={circleProps}
        fill="none"
      />
      <Circle cx="44" cy="44" r="30" fill="#DC2626" fillOpacity="0.15" />
      <AnimatedPath
        d="M34 34L54 54M54 34L34 54"
        stroke="#DC2626"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={36}
        animatedProps={pathProps}
      />
    </Svg>
  );
}

function PhoneSmallIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke="#1A56FF" strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="18" r="1.3" fill="#1A56FF" />
    </Svg>
  );
}

function ChevronRightIcon({ color = "white" }: { color?: string }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path d="M6 4L10 8L6 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  kind: "accept" | "reject";
  device: DeviceData;
  onViewDevice: () => void;
  onBackHome: () => void;
};

function SuccessOverlay({ kind, device, onViewDevice, onBackHome }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const isAccept = kind === "accept";

  return (
    <View style={s.screen}>
      <LinearGradient colors={isAccept ? ["#16A34A", "#15803D"] : ["#DC2626", "#B91C1C"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        <View style={s.decoCircleRight} />
        <View style={s.decoCircleLeft} />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          {isAccept ? <CheckmarkIcon /> : <XMarkIcon />}
        </Animated.View>
        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle}>
            {isAccept ? "Transfer Accepted!" : "Transfer Declined"}
          </Text>
          <Text style={s.headerSub}>
            {isAccept
              ? `You are now the new owner of ${device.name}. A new certificate has been issued in your name.`
              : `You have declined the ownership transfer of ${device.name}. The seller has been notified.`}
          </Text>
        </View>
      </LinearGradient>

      <View style={s.waveWrap}>
        <Svg viewBox="0 0 390 30" width="100%" height={30}>
          <Path d="M0 0 Q97.5 30 195 15 Q292.5 0 390 22 L390 0 Z" fill={isAccept ? "#15803D" : "#B91C1C"} />
        </Svg>
      </View>

      <View style={s.content}>
        {isAccept && (
          <View style={s.deviceCard}>
            <View style={s.deviceCardIcon}>
              <PhoneSmallIcon />
            </View>
            <View style={s.deviceCardInfo}>
              <Text style={s.deviceCardName}>{device.name}</Text>
              <Text style={s.deviceCardSpecs}>{device.brand} · {device.storage} · {device.imei}</Text>
            </View>
            <View style={s.ownershipBadge}>
              <Text style={s.ownershipBadgeText}>YOURS</Text>
            </View>
          </View>
        )}

        <View style={s.messageCard}>
          <Text style={s.certLabel}>CERTIFICATE</Text>
          <Text style={s.certTitle}>
            {isAccept ? "Digital Ownership Certificate" : "Transfer Request Closed"}
          </Text>
          <Text style={s.certDesc}>
            {isAccept
              ? `A digital certificate of ownership has been generated for ${device.name} and recorded on the blockchain. This serves as your official proof of ownership.`
              : `The transfer request has been marked as declined. No changes were made to the current ownership record.`}
          </Text>
        </View>

        <Pressable style={s.primaryBtn} onPress={onViewDevice}>
          <Text style={s.primaryText}>
            {isAccept ? "View My Device" : "View Device Details"}
          </Text>
          <ChevronRightIcon color="white" />
        </Pressable>
        <Pressable style={s.secondaryBtn} onPress={onBackHome}>
          <Text style={s.secondaryText}>Back to Home</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </View>
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
    paddingBottom: 48,
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  decoCircleRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  decoCircleLeft: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerTextWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
  },
  waveWrap: {
    marginTop: -1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  deviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  deviceCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  deviceCardInfo: {
    flex: 1,
    minWidth: 0,
  },
  deviceCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  deviceCardSpecs: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  ownershipBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  ownershipBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
    letterSpacing: 0.5,
  },
  messageCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  certLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
    marginTop: 4,
  },
  certDesc: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 19,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  secondaryBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default memo(SuccessOverlay);
