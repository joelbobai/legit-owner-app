import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function LockIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Rect x="5" y="12" width="18" height="13" rx="3" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
      <Path d="M9 12V9C9 6.8 11.2 5 14 5C16.8 5 19 6.8 19 9V12" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <Circle cx="14" cy="18" r="2" fill="#F59E0B" opacity="0.6" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path d="M6 1L7.5 4.5H11L8.2 6.8L9.2 10.5L6 8.5L2.8 10.5L3.8 6.8L1 4.5H4.5L6 1Z" fill="white" />
    </Svg>
  );
}

const HISTORY_ROWS = [
  "Today 14:32 · Maitama, Abuja",
  "Today 10:15 · Wuse II, Abuja",
  "Yesterday 18:44 · Garki, Abuja",
];

function PremiumHistoryCard() {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Location History</Text>
        <View style={s.premiumBadge}>
          <StarIcon />
          <Text style={s.premiumLabel}>PREMIUM</Text>
        </View>
      </View>

      <View style={s.timeline}>
        {HISTORY_ROWS.map((item, i) => (
          <View key={i} style={s.timelineRow}>
            <View style={s.timelineDot} />
            <Text style={s.timelineText}>{item}</Text>
          </View>
        ))}
        <View style={s.blurOverlay}>
          <LockIcon />
          <Text style={s.blurText}>Track real-time movement & get alerts</Text>
        </View>
      </View>

      <Pressable style={s.upgradeBtn}>
        <StarIcon />
        <Text style={s.upgradeText}>Upgrade to Premium</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F59E0B",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  premiumLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.5,
  },
  timeline: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    backgroundColor: "white",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1A56FF",
  },
  timelineText: {
    fontSize: 12,
    color: "#4A4A4A",
  },
  blurOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(248,250,252,0.7)",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  blurText: {
    fontSize: 12,
    color: "#64748B",
  },
  upgradeBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(PremiumHistoryCard);
