import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import AlertToggle from "@/components/tracking/AlertToggle";

type Props = {
  label: string;
  sub?: string;
  value: boolean;
  badge?: string;
  onChange: (value: boolean) => void;
};

function ToggleRow({ label, sub, value, badge, onChange }: Props) {
  const scale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(248,250,252,${bgOpacity.value})`,
  }));

  const handlePress = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.98); bgOpacity.value = withSpring(1); }}
        onPressOut={() => { scale.value = withSpring(1); bgOpacity.value = withSpring(0); }}
        style={s.row}
      >
        <View style={s.textWrap}>
          <View style={s.labelRow}>
            <Text style={s.label}>{label}</Text>
            {badge && <View style={s.badge}><Text style={s.badgeText}>{badge}</Text></View>}
          </View>
          {sub && <Text style={s.sub}>{sub}</Text>}
        </View>
        <AlertToggle value={value} onChange={handlePress} />
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  badge: {
    backgroundColor: "#EEF3FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A56FF",
  },
  sub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
    lineHeight: 17,
  },
});

export default memo(ToggleRow);
