import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { FontFamily } from "@/constants/typography";

export type PaymentMethod = {
  id: string;
  label: string;
  disabled?: boolean;
  icon: (active: boolean) => React.ReactNode;
};

type Props = {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (id: string) => void;
};

function PaymentMethodCard({ method, selected, onSelect }: Props) {
  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: selected ? withTiming("#1A56FF", { duration: 180 }) : withTiming("white", { duration: 180 }),
    borderColor: selected ? withTiming("#1A56FF" as any, { duration: 180 }) : withTiming("#E2E8F0" as any, { duration: 180 }),
    transform: [
      {
        scale: selected
          ? withSpring(1.04, { stiffness: 200, damping: 14 })
          : withSpring(1, { stiffness: 200, damping: 14 }),
      },
    ],
    shadowOpacity: selected ? withTiming(0.3, { duration: 180 }) : withTiming(0.06, { duration: 180 }),
  }));

  return (
    <Pressable onPress={() => onSelect(method.id)}>
      <Animated.View style={[s.card, animStyle]}>
        {method.icon(selected)}
        <Text
          style={[
            s.label,
            selected && { color: "white" },
          ]}
        >
          {method.label}
        </Text>
        {selected && (
          <Animated.View style={s.checkCircle}>
            <Svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <Path
                d="M1.5 4.5L3.5 6.5L7.5 2.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        )}
        {method.disabled && !selected && (
          <Text style={s.comingSoon}>Soon</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A4A4A",
    fontFamily: FontFamily.semibold,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  comingSoon: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    fontFamily: FontFamily.bold,
    letterSpacing: 0.3,
    marginLeft: 2,
  },
});

export default memo(PaymentMethodCard);
