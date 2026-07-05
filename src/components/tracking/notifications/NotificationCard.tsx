import { memo, useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, FadeIn } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

/* ─── Icon components ─── */

function CheckCircleIcon({ color = "#16A34A", size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth="2" fill="none" />
      <Path d="M7.5 12L10.5 15L16.5 9" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldWarningIcon({ color = "#DC2626", size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Path d="M12 8V13" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx={12} cy={16.5} r={1.1} fill={color} />
    </Svg>
  );
}

function InfoCircleIcon({ color = "#1A56FF", size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth="2" fill="none" />
      <Path d="M12 11V17" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx={12} cy={7.5} r={1.2} fill={color} />
    </Svg>
  );
}

function ArrowsLR({ color = "#1A56FF", size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 7H19M19 7L15 3M19 7L15 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 17H5M5 17L9 13M5 17L9 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path d="M6 4L10 8L6 12" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ─── Icon config ─── */
const ICON_MAP = {
  success: { Comp: CheckCircleIcon, color: "#16A34A", bg: "#DCFCE7" },
  alert: { Comp: ShieldWarningIcon, color: "#DC2626", bg: "#FEE2E2" },
  info: { Comp: InfoCircleIcon, color: "#1A56FF", bg: "#EEF3FF" },
  transfer: { Comp: ArrowsLR, color: "#1A56FF", bg: "#EEF3FF" },
} as const;

export type NotificationKind = keyof typeof ICON_MAP;
export type NotificationCategory = "devices" | "transfers" | "alerts";

export type NotificationItem = {
  id: number;
  kind: NotificationKind;
  section: "today" | "earlier";
  cat: NotificationCategory;
  unread: boolean;
  title: string;
  subtitle: string;
  time: string;
};

/* ─── Unread pulse dot ─── */
function UnreadDot() {
  const pulseOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      true,
    );
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      true,
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={s.dotOuter}>
      <Animated.View style={[s.dotGlow, glowStyle]} />
      <View style={s.dotCore} />
    </View>
  );
}

/* ─── Transfer request inline actions ─── */
function TransferActions() {
  return (
    <View style={s.transferActions}>
      <LinearGradient colors={["#1A56FF", "#0A2ECC"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.acceptBtn}>
        <Text style={s.acceptText}>Accept</Text>
      </LinearGradient>
      <View style={s.declineBtn}>
        <Text style={s.declineText}>Decline</Text>
      </View>
    </View>
  );
}

/* ─── Card ─── */
type Props = {
  item: NotificationItem;
  onPress: () => void;
};

function NotificationCard({ item, onPress }: Props) {
  const { Comp, color, bg } = ICON_MAP[item.kind];
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.985);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(300)} style={cardStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[s.card, item.unread ? s.cardUnread : s.cardRead]}
      >
        <View style={s.iconArea}>
          {item.unread && <UnreadDot />}
          <View style={[s.iconCircle, { backgroundColor: bg }]}>
            <Comp color={color} size={22} />
          </View>
        </View>

        <View style={s.body}>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={s.time}>{item.time}</Text>
          </View>
          <Text style={s.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>

          {item.kind === "transfer" && item.unread && <TransferActions />}
        </View>

        {!item.unread && (
          <View style={s.chevronWrap}>
            <ChevronRightIcon />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardUnread: {
    backgroundColor: "#EEF3FF",
  },
  cardRead: {
    backgroundColor: "white",
  },
  iconArea: {
    position: "relative",
    flexShrink: 0,
  },
  dotOuter: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1A56FF",
    borderWidth: 2,
    borderColor: "#EEF3FF",
  },
  dotGlow: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 7,
    backgroundColor: "#1A56FF",
    opacity: 0.35,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    lineHeight: 20,
    flex: 1,
    minWidth: 0,
  },
  time: {
    fontSize: 12,
    color: "#94A3B8",
    fontVariant: ["tabular-nums"],
    paddingTop: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 3,
    lineHeight: 19,
  },
  chevronWrap: {
    alignSelf: "center",
    paddingLeft: 4,
  },
  transferActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  acceptBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  declineBtn: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  declineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});

export default memo(NotificationCard);
