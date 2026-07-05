import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function ChevronRightIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M6 4L10 8L6 12" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  deviceCount: number;
  memberSince: string;
};

function StatsCard({ deviceCount, memberSince }: Props) {
  return (
    <View style={s.card}>
      <View style={s.countCol}>
        <Text style={s.countNum}>{deviceCount}</Text>
        <Text style={s.countLabel}>Devices Registered</Text>
      </View>
      <View style={s.divider} />
      <View style={s.memberCol}>
        <Text style={s.memberLabel}>Member since</Text>
        <Text style={s.memberValue}>{memberSince}</Text>
        <ChevronRightIcon />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  countCol: {
    flex: 1,
    alignItems: "center",
  },
  countNum: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0D0D0D",
  },
  countLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
  },
  memberCol: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberLabel: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  memberValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
});

export default memo(StatsCard);
