import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

function ShieldCheckIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z"
        fill="#16A34A"
        fillOpacity="0.12"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M8.5 12L11 14.5L15.5 9.5"
        stroke="#16A34A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type Props = {
  sellerName: string;
};

function ResponsibilityTransferCard({ sellerName }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(500).delay(350)} style={s.card}>
      <View style={s.iconWrap}>
        <ShieldCheckIcon />
      </View>
      <View style={s.textWrap}>
        <Text style={s.title}>{sellerName} is no longer liable for this device</Text>
        <Text style={s.subtitle}>All future responsibility now belongs to you.</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: 24,
    backgroundColor: "white",
    borderLeftWidth: 4,
    borderLeftColor: "#16A34A",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0D0D0D",
    lineHeight: 19,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 17,
  },
});

export default memo(ResponsibilityTransferCard);
