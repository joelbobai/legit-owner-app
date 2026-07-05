import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, withDelay, Easing } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

function AnimatedCheckmark() {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const checkOffset = useSharedValue(100);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 200 });
    checkOffset.value = withDelay(300, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    ringScale.value = withRepeat(
      withTiming(1.04, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <Animated.View style={[s.checkWrap, outerStyle]}>
      <Animated.View style={[s.ringPulse, pulseStyle]}>
        <Svg width={148} height={148} viewBox="0 0 148 148" fill="none">
          <Circle cx={74} cy={74} r={70} stroke="#16A34A" strokeWidth={8} fill="white" />
        </Svg>
      </Animated.View>
      <View style={s.checkInner}>
        <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
          <Circle cx={50} cy={50} r={44} fill="#16A34A" fillOpacity={0.08} />
          <Path
            d="M28 52L42 66L72 36"
            stroke="#16A34A"
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={100}
            strokeDashoffset={100}
          />
        </Svg>
      </View>
    </Animated.View>
  );
}

type Props = {
  deviceName: string;
  imei: string;
};

function SuccessHero({ deviceName, imei }: Props) {
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(10);
  const subtitleOpacity = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withDelay(150, withTiming(1, { duration: 500 }));
    titleTranslate.value = withDelay(150, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
    subtitleOpacity.value = withDelay(350, withTiming(1, { duration: 400 }));
    badgeOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
  }));

  return (
    <View style={s.wrap}>
      <View style={s.halo} />
      <AnimatedCheckmark />

      <Animated.View style={[s.textBlock, titleStyle]}>
        <Text style={s.title}>Ownership{"\n"}Transferred!</Text>
      </Animated.View>

      <Animated.View style={subtitleStyle}>
        <Text style={s.subtitle}>
          {deviceName} is now registered under your name
        </Text>
      </Animated.View>

      <Animated.View style={[s.imeiBadge, badgeStyle]}>
        <View style={s.imeiDot} />
        <Text style={s.imeiText}>IMEI: {imei}</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingTop: 36,
  },
  halo: {
    position: "absolute",
    top: 30,
    left: "50%",
    marginLeft: -150,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(220,252,231,0.85)",
  },
  checkWrap: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ringPulse: {
    position: "absolute",
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  checkInner: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  textBlock: {
    marginTop: 28,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0D0D0D",
    letterSpacing: -0.8,
    lineHeight: 34,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#4A4A4A",
    marginTop: 10,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
  },
  imeiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: "#DCFCE7",
    marginTop: 10,
  },
  imeiDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  imeiText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#15803D",
    fontVariant: ["tabular-nums"],
  },
});

export default SuccessHero;
