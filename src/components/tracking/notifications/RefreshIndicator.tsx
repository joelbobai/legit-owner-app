import { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

function RefreshIndicator() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1,
    );
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.spinner, spinStyle]} />
      <Text style={s.label}>Refreshing...</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingBottom: 14,
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: "rgba(26,86,255,0.25)",
    borderTopColor: "#1A56FF",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default memo(RefreshIndicator);
