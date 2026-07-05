import { memo, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
  visible: boolean;
};

function Tooltip({ visible }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 250 });
    translateY.value = withTiming(visible ? 0 : -8, { duration: 250 });
  }, [visible, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[s.tooltip, animatedStyle]}>
      <View style={s.arrow} />
      <Text style={s.text}>
        Open your phone dialer and type{" "}
        <Text style={s.highlight}>*#06#</Text> — your IMEI will appear
        automatically on screen.
      </Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  tooltip: {
    position: "absolute",
    top: 28,
    left: 0,
    zIndex: 100,
    backgroundColor: "#0D0D0D",
    borderRadius: 10,
    padding: 12,
    width: 260,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  arrow: {
    position: "absolute",
    top: -6,
    left: 10,
    width: 12,
    height: 12,
    backgroundColor: "#0D0D0D",
    transform: [{ rotate: "45deg" }],
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    color: "white",
    lineHeight: 19,
  },
  highlight: {
    color: "#93C5FD",
    fontWeight: "700",
  },
});

export default memo(Tooltip);
