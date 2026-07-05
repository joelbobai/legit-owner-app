import { memo, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

function PaperPlaneIcon({ color = "white", size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 3L11 13M21 3L14.5 21L11 13M21 3L3 9.5L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function InfoCircleSmallIcon() {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="1.6" fill="none" />
      <Path d="M12 11V17" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="7.5" r="1.2" fill="#94A3B8" />
    </Svg>
  );
}

type Props = {
  disabled: boolean;
  pressing: boolean;
  showHelper: boolean;
  helperText: string;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
};

function TransferButton({ disabled, pressing, showHelper, helperText, onPress, onPressIn, onPressOut }: Props) {
  const scale = useSharedValue(1);
  const shimmerX = useSharedValue(-100);

  useEffect(() => {
    if (!disabled) {
      shimmerX.value = withRepeat(
        withTiming(200, { duration: 2500, easing: Easing.linear }),
        -1,
      );
    } else {
      shimmerX.value = -100;
    }
  }, [disabled, shimmerX]);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <View>
      <Animated.View style={btnStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => { if (!disabled) { scale.value = withSpring(0.97); onPressIn(); } }}
          onPressOut={() => { if (!disabled) { scale.value = withSpring(1); onPressOut(); } }}
          disabled={disabled}
          style={[s.btn, disabled ? s.btnDisabled : s.btnActive]}
        >
          {!disabled && (
            <View style={s.shimmerTrack}>
              <Animated.View style={[s.shimmerBar, shimmerStyle]} />
            </View>
          )}
          <PaperPlaneIcon color={disabled ? "#94A3B8" : "white"} size={20} />
          <Text style={[s.btnLabel, { color: disabled ? "#94A3B8" : "white" }]}>
            {pressing ? "Sending…" : "Send Transfer Request"}
          </Text>
        </Pressable>
      </Animated.View>

      {showHelper && (
        <View style={s.helperRow}>
          <InfoCircleSmallIcon />
          <Text style={s.helperText}>{helperText}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "hidden",
    position: "relative",
  },
  btnActive: {
    backgroundColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  btnDisabled: {
    backgroundColor: "#E2E8F0",
  },
  shimmerTrack: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shimmerBar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 40,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: "600",
    position: "relative",
  },
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },
  helperText: {
    fontSize: 11,
    color: "#94A3B8",
  },
});

export default memo(TransferButton);
