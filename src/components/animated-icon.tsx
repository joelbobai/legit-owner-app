import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from "react-native-svg";

const { width: SW } = Dimensions.get("window");

function ShieldLogo() {
  return (
    <Svg width={140} height={140} viewBox="0 0 140 140" fill="none">
      <Defs>
        <LinearGradient
          id="sg"
          x1="32"
          y1="12"
          x2="108"
          y2="118"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1A56FF" />
        </LinearGradient>
      </Defs>
      <Path
        d="M70 12 L108 28 L108 68 C108 90 90 108 70 118 C50 108 32 90 32 68 L32 28 Z"
        fill="url(#sg)"
      />
      <Rect
        x="57"
        y="45"
        width="26"
        height="40"
        rx="5"
        fill="white"
        opacity={0.95}
      />
      <Rect x="60" y="48" width="20" height="30" rx="3" fill="#BFDBFE" />
      <Rect
        x="65"
        y="81"
        width="10"
        height="2"
        rx="1"
        fill="white"
        opacity={0.6}
      />
      <Circle cx="92" cy="52" r="13" fill="white" />
      <Circle cx="92" cy="52" r="11" fill="#1A56FF" />
      <Polyline
        points="86,52 90,57 98,46"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.3);
  const splashOpacity = useSharedValue(1);

  const dot1Opacity = useSharedValue(0.3);
  const dot1Scale = useSharedValue(0.85);
  const dot2Opacity = useSharedValue(0.3);
  const dot2Scale = useSharedValue(0.85);
  const dot3Opacity = useSharedValue(0.3);
  const dot3Scale = useSharedValue(0.85);

  const hide = () => setVisible(false);

  useEffect(() => {
    const loop = (duration: number) => ({
      duration,
      easing: Easing.inOut(Easing.ease),
    });

    ringScale.value = withRepeat(
      withSequence(withTiming(1.04, loop(2000)), withTiming(1, loop(2000))),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(withTiming(0.15, loop(2000)), withTiming(0.3, loop(2000))),
      -1,
      false,
    );

    const pulseDot = (
      opSV: typeof dot1Opacity,
      scaleSV: typeof dot1Scale,
      delay: number,
    ) => {
      const cfg = loop(600);
      opSV.value = withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, cfg), withTiming(0.3, cfg)),
          -1,
          false,
        ),
      );
      scaleSV.value = withDelay(
        delay,
        withRepeat(
          withSequence(withTiming(1, cfg), withTiming(0.85, cfg)),
          -1,
          false,
        ),
      );
    };

    pulseDot(dot1Opacity, dot1Scale, 0);
    pulseDot(dot2Opacity, dot2Scale, 200);
    pulseDot(dot3Opacity, dot3Scale, 400);

    splashOpacity.value = withDelay(
      2500,
      withTiming(
        0,
        { duration: 500, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished) runOnJS(hide)();
        },
      ),
    );
  }, []);

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));
  const splashAnimStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));
  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
    transform: [{ scale: dot1Scale.value }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
    transform: [{ scale: dot2Scale.value }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
    transform: [{ scale: dot3Scale.value }],
  }));

  if (!visible) return null;

  return (
    // pointerEvents="none": the splash is purely visual — it must never intercept
    // touches. Without this, the overlay stays in the JS tree (blocking all taps)
    // for 1-2 frames after Reanimated finishes fading it to opacity 0 on the UI
    // thread. During that window, taps are swallowed, then re-dispatched to ALL
    // underlying views when the View finally unmounts → every TextInput in the
    // visible form appears to activate at the same time.
    <Animated.View style={[styles.splashContainer, splashAnimStyle]} pointerEvents="none">
      <Animated.View style={[styles.ringOuter, ringAnimStyle]} />
      <View style={styles.ringInner} />

      <View style={styles.splashContent}>
        <View style={styles.logoWrap}>
          <ShieldLogo />
        </View>

        <View style={styles.brandRow}>
          <Text style={[styles.brand, { color: "#1A56FF" }]}>LEGIT</Text>
          <Text style={[styles.brand, { color: "#0D0D0D" }]}> OWNER</Text>
        </View>

        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.taglineText}>VERIFY . TRACK . PROTECT</Text>
          <View style={styles.taglineLine} />
        </View>

        <View style={styles.dotsRow}>
          <Animated.View
            style={[styles.dot, { backgroundColor: "#CBD5E1" }, dot1Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: "#1A56FF" }, dot2Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: "#CBD5E1" }, dot3Style]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  ringOuter: {
    position: "absolute",
    width: SW * 1.25,
    height: SW * 1.25,
    borderRadius: SW * 0.625,
    backgroundColor: "#EEF3FF",
  },
  ringInner: {
    position: "absolute",
    width: SW * 0.8,
    height: SW * 0.8,
    borderRadius: SW * 0.4,
    backgroundColor: "#EEF3FF",
    opacity: 0.6,
  },
  splashContent: {
    alignItems: "center",
  },
  logoWrap: {
    marginBottom: 16,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brand: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 3,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  taglineLine: {
    width: 20,
    height: 1.5,
    backgroundColor: "#CBD5E1",
    borderRadius: 1,
  },
  taglineText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2.5,
    color: "#94A3B8",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 64,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
