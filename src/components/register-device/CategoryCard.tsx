import { memo, useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onSelect: () => void;
};

function CategoryCard({ icon, label, selected, onSelect }: Props) {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(selected ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { stiffness: 300, damping: 10 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { stiffness: 300, damping: 10 });
  }, [scale]);

  return (
    <Animated.View style={[s.wrapper, animatedStyle]}>
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          s.card,
          selected ? s.cardSelected : s.cardUnselected,
        ]}
      >
        <View style={[s.iconBox, selected && s.iconBoxSelected]}>
          {icon}
        </View>
        <Text style={[s.label, selected && s.labelSelected]} numberOfLines={2}>
          {label}
        </Text>
        {selected && (
          <View style={s.check}>
            <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <Circle cx="9" cy="9" r="9" fill="#1A56FF" />
              <Path
                d="M5.5 9L7.8 11.3L12.5 6.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
  },
  card: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 100,
    position: "relative",
  },
  cardUnselected: {
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: "#EEF3FF",
    borderWidth: 2,
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F1F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: {
    backgroundColor: "rgba(26,86,255,0.10)",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D0D0D",
    textAlign: "center",
    lineHeight: 14,
    paddingHorizontal: 4,
  },
  labelSelected: {
    color: "#1A56FF",
  },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default memo(CategoryCard);
