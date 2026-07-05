import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  value: string;
  onSelect: (v: string) => void;
};

const CONDITIONS = [
  { id: "new", label: "New", color: "#16A34A" },
  { id: "good", label: "Used — Good", color: "#1A56FF" },
  { id: "fair", label: "Used — Fair", color: "#F59E0B" },
];

function ConditionPill({
  item,
  active,
  onPress,
}: {
  item: (typeof CONDITIONS)[0];
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { stiffness: 300, damping: 10 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { stiffness: 300, damping: 10 });
  }, [scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[s.pillWrap, animStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          s.pill,
          active
            ? { backgroundColor: item.color, borderColor: item.color }
            : { backgroundColor: "white", borderColor: "#E2E8F0" },
          active && s.pillActive,
        ]}
      >
        <Text style={[s.pillText, { color: active ? "white" : item.color }]}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function ConditionSelector({ value, onSelect }: Props) {
  return (
    <View>
      <View style={s.labelRow}>
        <Text style={s.label}>Condition</Text>
        <Text style={s.required}>*</Text>
      </View>
      <View style={s.row}>
        {CONDITIONS.map((item) => (
          <ConditionPill
            key={item.id}
            item={item}
            active={value === item.id}
            onPress={() => onSelect(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  required: {
    fontSize: 11,
    color: "#DC2626",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  pillWrap: {
    flex: 1,
  },
  pill: {
    height: 44,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  pillActive: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default memo(ConditionSelector);
