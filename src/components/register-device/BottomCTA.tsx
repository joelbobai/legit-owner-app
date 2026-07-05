import { memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { FontFamily } from "@/constants/typography";

type Props = {
  total: number;
  paying: boolean;
  disabled: boolean;
  onPress: () => void;
};

function BottomCTA({ total, paying, disabled, onPress }: Props) {
  const animStyle = useAnimatedStyle(() => ({
    opacity: withTiming(disabled ? 0.5 : 1, { duration: 250 }),
  }));

  return (
    <Animated.View style={[s.wrapper, animStyle]}>
      <Text style={s.agentNote}>
        If registering through an agent, this fee will be deducted from
        their wallet — you pay nothing.
      </Text>
      <Pressable
        style={[s.btn, disabled && s.btnDisabled]}
        onPress={onPress}
        disabled={disabled || paying}
      >
        <LinearGradient
          colors={
            disabled ? ["#CBD5E1", "#CBD5E1"] : ["#1A56FF", "#0A2ECC"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.gradient}
        >
          {paying ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text style={s.text}>Processing…</Text>
            </>
          ) : (
            <>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="2.5"
                  stroke="white"
                  strokeWidth="1.6"
                  fill="none"
                />
                <Path d="M2 8H18" stroke="white" strokeWidth="1.5" />
                <Rect
                  x="4"
                  y="11"
                  width="5"
                  height="2"
                  rx="1"
                  fill="white"
                  opacity="0.7"
                />
              </Svg>
              <Text style={s.text}>
                Complete Registration & Pay ₦{total}
              </Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "#F5F7FA",
    gap: 10,
  },
  agentNote: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
    lineHeight: 16,
  },
  btn: {
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  btnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  gradient: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
    fontFamily: FontFamily.semibold,
  },
});

export default memo(BottomCTA);
