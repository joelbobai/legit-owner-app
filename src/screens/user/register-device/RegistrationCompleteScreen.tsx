import { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

export default function RegistrationCompleteScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useDeviceRegistration();

  const scale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { stiffness: 120, damping: 12 });
    checkOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    textOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    btnOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));
  }, [scale, checkOpacity, textOpacity, btnOpacity]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withTiming(textOpacity.value * 0, { duration: 0 }) }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  const handleDone = useCallback(() => {
    router.replace("/(user)/(tabs)/devices" as any);
  }, []);

  return (
    <View style={s.screen}>
      <LinearGradient
        colors={["#1A56FF", "#0A2ECC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          s.overlay,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Animated.View style={[s.circleWrap, circleStyle]}>
          <View style={s.circle}>
            <Svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <Circle cx="36" cy="36" r="34" fill="rgba(255,255,255,0.12)" />
              <Circle cx="36" cy="36" r="34" stroke="white" strokeWidth="3" />
            </Svg>
          </View>
          <Animated.View style={[s.checkWrap, checkStyle]}>
            <Svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <Path
                d="M24 37L32 45L48 28"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[s.textBlock, textStyle]}>
          <Text style={s.title}>Device Registered{'\n'}Successfully!</Text>
          <Text style={s.desc}>
            {data.name || "Your device"} has been registered and is now
            protected under your ownership.
          </Text>
        </Animated.View>

        <Animated.View style={[s.btnWrap, btnStyle]}>
          <Pressable style={s.btn} onPress={handleDone}>
            <Text style={s.btnText}>View My Devices</Text>
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Path
                d="M4 10H16M16 10L10 4M16 10L10 16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  circleWrap: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
  },
  checkWrap: {
    position: "absolute",
  },
  textBlock: {
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  desc: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    maxWidth: 280,
  },
  btnWrap: {
    marginTop: 48,
    width: "100%",
  },
  btn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
});
