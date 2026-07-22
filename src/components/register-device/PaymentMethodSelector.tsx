import { memo } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FontFamily } from "@/constants/typography";

import PaymentMethodCard, {
  type PaymentMethod,
} from "./PaymentMethodCard";

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bank",
    label: "Bank Transfer",
    disabled: true,
    icon: (active) => (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path
          d="M3 9H19M4 9V17M8 9V17M14 9V17M18 9V17M11 3L19 9H3L11 3Z"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M2 17H20"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    ),
  },
  {
    id: "paystack",
    label: "Paystack",
    icon: (active) => (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Rect
          width="22"
          height="22"
          rx="4"
          fill={active ? "rgba(255,255,255,0.2)" : "#F1F5F9"}
        />
            <SvgText
              x="11"
              y="16"
              textAnchor="middle"
              fontSize={13}
              fontWeight="800"
              fill={active ? "white" : "#00C3F7"}
              fontFamily="Inter"
            >
              P
            </SvgText>
      </Svg>
    ),
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    disabled: true,
    icon: (active) => (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Rect
          width="22"
          height="22"
          rx="4"
          fill={active ? "rgba(255,255,255,0.2)" : "#FFF5EE"}
        />
        <Path
          d="M7 8C8.5 6 10.5 5.5 12 7C13.5 8.5 12 11 13.5 12.5C15 14 17 13.5 15.5 16"
          stroke={active ? "white" : "#F5A623"}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M5 11C6.5 9 8.5 8.5 10 10C11.5 11.5 10 14 11.5 15.5"
          stroke={active ? "white" : "#F5A623"}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    ),
  },
  {
    id: "ussd",
    label: "USSD",
    disabled: true,
    icon: (active) => (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Rect
          x="5"
          y="2"
          width="12"
          height="18"
          rx="3"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d="M8 8H14M8 11H14M8 14H11"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <Circle
          cx="14.5"
          cy="14.5"
          r="1"
          fill={active ? "white" : "#64748B"}
        />
      </Svg>
    ),
  },
  {
    id: "airtime",
    label: "Airtime",
    disabled: true,
    icon: (active) => (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path
          d="M4 11C4 7.1 7.1 4 11 4C14.9 4 18 7.1 18 11"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M7 11C7 9 8.8 7.3 11 7.3C13.2 7.3 15 9 15 11"
          stroke={active ? "white" : "#64748B"}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <Circle
          cx="11"
          cy="14"
          r="2"
          fill={active ? "white" : "#64748B"}
        />
      </Svg>
    ),
  },
];

type Props = {
  selected: string | null;
  onSelect: (id: string) => void;
};

function PaymentMethodSelector({ selected, onSelect }: Props) {
  const handleSelect = (id: string) => {
    if (id !== "paystack") {
      Alert.alert("Coming Soon", `${PAYMENT_METHODS.find(m => m.id === id)?.label} will be available soon. Please use Paystack.`);
      return;
    }
    onSelect(id);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200)}
      style={s.container}
    >
      <Text style={s.title}>Choose Payment Method</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            selected={selected === method.id}
            onSelect={handleSelect}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingLeft: 20,
    marginTop: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    fontFamily: FontFamily.semibold,
    marginBottom: 12,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 20,
  },
});

export default memo(PaymentMethodSelector);
