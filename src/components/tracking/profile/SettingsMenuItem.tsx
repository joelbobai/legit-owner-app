import { memo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

function ChevronRightIcon({ color = "#CBD5E1" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path d="M6 4L10 8L6 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  icon: ReactNode;
  label: string;
  color?: string;
  danger?: boolean;
  sub?: string;
  onPress?: () => void;
};

function SettingsMenuItem({ icon, label, color = "#0D0D0D", danger = false, sub, onPress }: Props) {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(248,250,252,${bgOpacity.value})`,
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98); bgOpacity.value = withSpring(1); }}
        onPressOut={() => { scale.value = withSpring(1); bgOpacity.value = withSpring(0); }}
        style={s.row}
      >
        <View style={s.iconWrap}>
          {icon}
        </View>
        <View style={s.textWrap}>
          <Text style={[s.label, { color: danger ? "#DC2626" : color }]}>{label}</Text>
          {sub && <Text style={s.sub}>{sub}</Text>}
        </View>
        {danger ? (
          <ChevronRightIcon color="#DC2626" />
        ) : (
          <ChevronRightIcon />
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    height: 56,
    paddingHorizontal: 20,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
});

export default memo(SettingsMenuItem);
