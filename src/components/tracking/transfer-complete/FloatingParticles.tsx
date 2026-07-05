import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withDelay } from "react-native-reanimated";

interface ParticleConfig {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  shape: "circle" | "square" | "triangle";
  drift: number;
}

function ParticleItem({ config }: { config: ParticleConfig }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      config.delay * 1000,
      withRepeat(
        withTiming(config.drift, { duration: config.duration * 1000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    translateX.value = withDelay(
      config.delay * 1000,
      withRepeat(
        withTiming(config.drift * 0.5, { duration: config.duration * 1000 * 1.2, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
    rotate.value = withDelay(
      config.delay * 1000,
      withRepeat(
        withTiming(config.drift > 0 ? 25 : -25, { duration: config.duration * 1000 * 1.5, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  if (config.shape === "triangle") {
    return (
      <Animated.View
        style={[
          animStyle,
          {
            position: "absolute",
            left: config.x,
            top: config.y,
            width: 0,
            height: 0,
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderBottomWidth: 9,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: config.color,
            opacity: 0.65,
          },
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        animStyle,
        {
          position: "absolute",
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
          borderRadius: config.shape === "circle" ? config.size / 2 : 1.5,
          backgroundColor: config.color,
          opacity: 0.7,
        },
      ]}
    />
  );
}

const PARTICLES: ParticleConfig[] = [
  { x: 32, y: 80, size: 10, color: "#1A56FF", duration: 3, delay: 0, shape: "circle", drift: -12 },
  { x: 320, y: 70, size: 12, color: "#F59E0B", duration: 3.4, delay: 0.4, shape: "circle", drift: 10 },
  { x: 60, y: 220, size: 8, color: "#16A34A", duration: 3.2, delay: 0.2, shape: "circle", drift: -8 },
  { x: 340, y: 200, size: 10, color: "#1A56FF", duration: 3.6, delay: 0.6, shape: "circle", drift: 12 },
  { x: 24, y: 320, size: 8, color: "#F59E0B", duration: 3.1, delay: 0.1, shape: "circle", drift: -10 },
  { x: 358, y: 290, size: 12, color: "#16A34A", duration: 3.5, delay: 0.5, shape: "circle", drift: 8 },
  { x: 78, y: 130, size: 8, color: "#EC4899", duration: 3.3, delay: 0.3, shape: "circle", drift: -6 },
  { x: 300, y: 140, size: 10, color: "#7C3AED", duration: 3.7, delay: 0.7, shape: "circle", drift: 14 },
  { x: 350, y: 380, size: 8, color: "#F59E0B", duration: 3.2, delay: 0.2, shape: "circle", drift: 9 },
  { x: 20, y: 410, size: 8, color: "#1A56FF", duration: 3.4, delay: 0.4, shape: "circle", drift: -11 },
  { x: 50, y: 170, color: "#1A56FF", duration: 3.2, delay: 0.1, shape: "triangle", drift: -8, size: 0 },
  { x: 330, y: 100, size: 8, color: "#16A34A", duration: 3.5, delay: 0.5, shape: "square", drift: 12 },
  { x: 110, y: 290, size: 8, color: "#F59E0B", duration: 3.3, delay: 0.3, shape: "square", drift: -7 },
  { x: 290, y: 340, color: "#EC4899", duration: 3.6, delay: 0.6, shape: "triangle", drift: 10, size: 0 },
];

function FloatingParticles() {
  return (
    <View style={s.container} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <ParticleItem key={i} config={p} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});

export default FloatingParticles;
