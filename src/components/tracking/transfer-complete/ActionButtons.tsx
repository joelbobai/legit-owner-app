import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from "react-native-reanimated";
import Svg, { Path, Circle, Rect } from "react-native-svg";

function DeviceMobileIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={6} y={2} width={12} height={20} rx={3} stroke="white" strokeWidth="2" fill="none" />
      <Circle cx={12} cy={18} r={1.2} fill="white" />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke="#1A56FF" strokeWidth="2" fill="none" />
      <Path d="M12 7V12L15 14" stroke="#1A56FF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

type Props = {
  onViewDevice: () => void;
  onViewHistory: () => void;
};

function ActionButtons({ onViewDevice, onViewHistory }: Props) {
  const primaryScale = useSharedValue(1);
  const secondaryScale = useSharedValue(1);

  const primaryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: primaryScale.value }],
  }));

  const secondaryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondaryScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(500).delay(550)} style={s.wrap}>
      <Animated.View style={primaryStyle}>
        <Pressable
          onPressIn={() => { primaryScale.value = withSpring(0.97); }}
          onPressOut={() => { primaryScale.value = withSpring(1); }}
          onPress={onViewDevice}
        >
          <LinearGradient colors={["#1A56FF", "#0A2ECC"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.primaryBtn}>
            <DeviceMobileIcon />
            <Text style={s.primaryText}>View My Device</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View style={secondaryStyle}>
        <Pressable
          onPressIn={() => { secondaryScale.value = withSpring(0.97); }}
          onPressOut={() => { secondaryScale.value = withSpring(1); }}
          onPress={onViewHistory}
          style={s.secondaryBtn}
        >
          <ClockIcon />
          <Text style={s.secondaryText}>View Transfer History</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 28,
    gap: 10,
  },
  primaryBtn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
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
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A56FF",
  },
});

export default memo(ActionButtons);
