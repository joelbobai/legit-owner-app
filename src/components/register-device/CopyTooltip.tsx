import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { FontFamily } from "@/constants/typography";

type Props = {
  visible: boolean;
};

export default function CopyTooltip({ visible }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-6);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
    translateY.value = withTiming(visible ? 0 : -6, { duration: 200 });
  }, [visible, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[s.tooltip, animStyle]}>
      <Text style={s.text}>Copied!</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  tooltip: {
    position: "absolute",
    top: -28,
    left: "50%",
    marginLeft: -30,
    backgroundColor: "#0D0D0D",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 100,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamily.semibold,
  },
});
