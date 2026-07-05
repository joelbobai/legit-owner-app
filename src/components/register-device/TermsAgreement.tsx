import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { FontFamily } from "@/constants/typography";

type Props = {
  agreed: boolean;
  onToggle: () => void;
};

function TermsAgreement({ agreed, onToggle }: Props) {
  const checkStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(1, { stiffness: 300, damping: 12 }),
      },
    ],
  }));

  return (
    <View style={s.container}>
      <Pressable onPress={onToggle} hitSlop={4}>
        <Animated.View
          style={[
            s.checkbox,
            agreed
              ? { borderWidth: 0 }
              : { borderWidth: 1.5, borderColor: "#CBD5E1" },
            checkStyle,
          ]}
        >
          {agreed ? (
            <LinearGradient
              colors={["#1A56FF", "#0A2ECC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.gradientFill}
            >
              <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <Path
                  d="M2 6L5 9L10 3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
          ) : (
            <View style={s.uncheckedFill} />
          )}
        </Animated.View>
      </Pressable>
      <Text style={s.text}>
        I agree to the{" "}
        <Text style={s.link}>Terms & Conditions</Text> and{" "}
        <Text style={s.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 1,
  },
  gradientFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  uncheckedFill: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: "#4A4A4A",
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    flex: 1,
  },
  link: {
    color: "#1A56FF",
    fontWeight: "600",
    fontFamily: FontFamily.semibold,
    textDecorationLine: "underline",
  },
});

export default memo(TermsAgreement);
