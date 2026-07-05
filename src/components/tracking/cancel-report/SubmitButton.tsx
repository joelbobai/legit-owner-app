import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

function ShieldCheckIcon({ color = "#DC2626" }: { color?: string }) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path d="M10 2L18 6V11C18 15 14 18 10 19C6 18 2 15 2 11V6L10 2Z" stroke={color} strokeWidth="1.6" fill="none" />
      <Path d="M7 10L9 12L13 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  disabled: boolean;
  onPress: () => void;
};

function SubmitButton({ disabled, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { if (!disabled) scale.value = withSpring(0.97); }}
        onPressOut={() => { if (!disabled) scale.value = withSpring(1); }}
        disabled={disabled}
        style={[s.btn, disabled ? s.btnDisabled : s.btnActive]}
      >
        <ShieldCheckIcon color={disabled ? "#CBD5E1" : "#DC2626"} />
        <Text style={[s.label, disabled ? s.labelDisabled : s.labelActive]}>
          Cancel Stolen Report
        </Text>
      </Pressable>
    </Animated.View>
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
  },
  btnActive: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  btnDisabled: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  labelActive: {
    color: "#DC2626",
  },
  labelDisabled: {
    color: "#CBD5E1",
  },
});

export default memo(SubmitButton);
