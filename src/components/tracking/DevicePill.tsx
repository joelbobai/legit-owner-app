import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { Device } from "@/types/device";

type Props = {
  device: Device;
  active: boolean;
  onPress: () => void;
};

function DeviceIcon({ color = "#94A3B8", size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="18" r="1.3" fill={color} />
    </Svg>
  );
}

function OnlineDot({ active, online }: { active: boolean; online: boolean }) {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!online) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 750, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    loop.start();
    return () => loop.stop();
  }, [online]);

  const dotColor = !online
    ? active ? "rgba(255,255,255,0.4)" : "#CBD5E1"
    : active ? "#4ADE80" : "#16A34A";

  return <Animated.View style={[s.dot, { backgroundColor: dotColor, opacity: online ? blink : 1 }]} />;
}

function DevicePill({ device, active, onPress }: Props) {
  const isOnline = device.status === "active";
  const tint = active ? "white" : "#0D0D0D";
  const subtitleColor = active ? "rgba(255,255,255,0.7)" : "#94A3B8";

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          s.pill,
          active
            ? { backgroundColor: "#1A56FF" }
            : { backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0" },
          active && s.pillShadow,
        ]}
      >
        <DeviceIcon color={tint} size={16} />
        <View>
          <Text style={[s.brand, { color: tint }]}>{device.brand}</Text>
          <Text style={[s.model, { color: subtitleColor }]}>{device.name}</Text>
        </View>
        <OnlineDot active={active} online={isOnline} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  pill: {
    flexShrink: 0,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillShadow: {
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  brand: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  model: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 12,
  },
});

export default memo(DevicePill);
