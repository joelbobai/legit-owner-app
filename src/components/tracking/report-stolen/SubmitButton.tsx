import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

function ShieldWarningWhite() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 9V13" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill="white" />
    </Svg>
  );
}

type Props = {
  disabled: boolean;
  pressing: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  label: string;
};

function SubmitButton({ disabled, pressing, onPress, onPressIn, onPressOut, label }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
    onPressIn();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    onPressOut();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[s.btn, disabled ? s.btnDisabled : s.btnActive]}
      >
        <ShieldWarningWhite />
        <Text style={[s.label, disabled ? s.labelDisabled : s.labelActive]}>
          {pressing ? "Submitting…" : label}
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
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  btnDisabled: {
    backgroundColor: "#E2E8F0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  labelActive: {
    color: "white",
  },
  labelDisabled: {
    color: "#94A3B8",
  },
});

export default memo(SubmitButton);
