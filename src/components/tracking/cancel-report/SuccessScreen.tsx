import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Device } from "@/types/device";

function CheckmarkIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="34" fill="#16A34A" />
      <Path d="M24 40L34 50L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SmallCheckIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="6" fill="#16A34A" />
      <Path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DeviceIconWhite() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke="white" strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="18" r="1" fill="white" />
    </Svg>
  );
}

type Props = {
  device: Device;
  onViewDevice: () => void;
  onBackToTrack: () => void;
};

function SuccessScreen({ device, onViewDevice, onBackToTrack }: Props) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pulseAnim, {
      toValue: 1,
      useNativeDriver: true,
      delay: 200,
    }).start();
  }, [pulseAnim]);

  const circleScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={s.screen}>
      <View style={s.content}>
        <Animated.View style={[s.circle, { transform: [{ scale: circleScale }] }]}>
          <CheckmarkIcon />
        </Animated.View>

        <Text style={s.title}>Report Cancelled!</Text>
        <Text style={s.subtitle}>
          {device.brand} {device.name} is now Active again
        </Text>

        <View style={s.statusRow}>
          <SmallCheckIcon />
          <Text style={s.statusText}>
            Device status restored · Transfers & verifications enabled
          </Text>
        </View>

        <View style={s.ctas}>
          <Pressable style={s.primaryBtn} onPress={onViewDevice}>
            <DeviceIconWhite />
            <Text style={s.primaryText}>View Device</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={onBackToTrack}>
            <Text style={s.secondaryText}>Back to Track</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DCFCE7",
    borderWidth: 6,
    borderColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0D0D0D",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A4A4A",
    marginTop: 10,
    lineHeight: 26,
    textAlign: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
  },
  ctas: {
    width: "100%",
    gap: 12,
    marginTop: 40,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
    flexDirection: "row",
    gap: 10,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  secondaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A56FF",
  },
});

export default memo(SuccessScreen);
