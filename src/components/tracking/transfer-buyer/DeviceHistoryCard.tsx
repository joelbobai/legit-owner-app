import { memo, useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeOut } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

type HistoryEvent = {
  title: string;
  date: string;
  description: string;
  type: "listed" | "interest" | "negotiation" | "verified" | "transfer";
};

function EventDot({ type }: { type: HistoryEvent["type"] }) {
  const colorMap = {
    listed: "#3B82F6",
    interest: "#F59E0B",
    negotiation: "#8B5CF6",
    verified: "#16A34A",
    transfer: "#1A56FF",
  };
  const bgMap = {
    listed: "#EFF6FF",
    interest: "#FEF3C7",
    negotiation: "#F3E8FF",
    verified: "#DCFCE7",
    transfer: "#EEF3FF",
  };

  return (
    <View style={[s.dotOuter, { backgroundColor: bgMap[type] }]}>
      <View style={[s.dotInner, { backgroundColor: colorMap[type] }]} />
    </View>
  );
}

function ChevronDownIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path d="M4 6L8 10L12 6" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="6.5" stroke="#94A3B8" strokeWidth="1.3" fill="none" />
      <Path d="M8 5V8.5L10 10" stroke="#94A3B8" strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

const EVENTS: HistoryEvent[] = [
  { title: "Device Listed for Sale", date: "May 10, 2026", description: "Adaeze listed the device on the marketplace with full specifications and photos.", type: "listed" },
  { title: "Buyer Showed Interest", date: "May 12, 2026", description: "You expressed interest and initiated contact with the seller.", type: "interest" },
  { title: "Price Negotiation", date: "May 13, 2026", description: "You and the seller agreed on a final price of ₦450,000.", type: "negotiation" },
  { title: "Device Verified", date: "May 14, 2026", description: "The device passed all verification checks — IMEI clean, no theft reports.", type: "verified" },
  { title: "Transfer Initiated", date: "May 15, 2026", description: "Seller initiated the ownership transfer. Awaiting your acceptance.", type: "transfer" },
];

function DeviceHistoryCard() {
  const [expanded, setExpanded] = useState(false);
  const rotate = useSharedValue(0);

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      rotate.value = withTiming(prev ? 0 : 180, { duration: 250 });
      return !prev;
    });
  }, [rotate]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={s.card}>
      <Pressable onPress={toggle} style={s.header}>
        <View style={s.headerLeft}>
          <ClockIcon />
          <Text style={s.headerTitle}>Device History</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDownIcon />
        </Animated.View>
      </Pressable>

      {expanded && (
        <Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)} style={s.timeline}>
          {EVENTS.map((event, i) => (
            <View key={i} style={s.eventRow}>
              {i < EVENTS.length - 1 && <View style={s.connector} />}
              <EventDot type={event.type} />
              <View style={s.eventContent}>
                <Text style={s.eventTitle}>{event.title}</Text>
                <Text style={s.eventDate}>{event.date}</Text>
                <Text style={s.eventDesc}>{event.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  timeline: {
    marginTop: 14,
    paddingLeft: 2,
    gap: 0,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    position: "relative",
    paddingBottom: 6,
  },
  connector: {
    position: "absolute",
    left: 11,
    top: 26,
    width: 1.5,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  dotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  eventContent: {
    flex: 1,
    paddingBottom: 12,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  eventDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  eventDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
  },
});

export default memo(DeviceHistoryCard);
