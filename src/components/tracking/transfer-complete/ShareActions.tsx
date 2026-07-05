import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";

function WhatsAppIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.3 17L2 22L7.2 20.7C8.6 21.5 10.3 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="white" />
      <Path d="M9 8C9 8 8 8 8 9.5C8 11 9 13 11 15C13 17 15 18 16.5 18C18 18 18 17 18 17V15.5L16 14.5L15 15.5C13.5 15 12 13.5 11.5 12L12.5 11L11.5 9L10 8H9Z" fill="#25D366" />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} fill="white" />
      <Path d="M3 7L12 13L21 7" stroke="#1A56FF" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function DownloadIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4V16M12 16L7 11M12 16L17 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 17V19C4 19.6 4.4 20 5 20H19C19.6 20 20 19.6 20 19V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function PrintIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9V4H18V9" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <Rect x={3} y={9} width={18} height={9} rx={2} fill="white" />
      <Rect x={6} y={14} width={12} height={6} fill="#0D0D0D" />
    </Svg>
  );
}

interface ShareItemProps {
  Icon: React.FC;
  bg: string;
  label: string;
}

function ShareCircle({ Icon, bg, label }: ShareItemProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={s.item}>
      <Animated.View style={animStyle}>
        <Pressable
          onPressIn={() => { scale.value = withSpring(0.92); }}
          onPressOut={() => { scale.value = withSpring(1); }}
          style={[s.circle, { backgroundColor: bg }]}
        >
          <Icon />
        </Pressable>
      </Animated.View>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const SHARE_ITEMS: ShareItemProps[] = [
  { Icon: WhatsAppIcon, bg: "#25D366", label: "WhatsApp" },
  { Icon: MailIcon, bg: "#1A56FF", label: "Email" },
  { Icon: DownloadIcon, bg: "#1A56FF", label: "Download" },
  { Icon: PrintIcon, bg: "#0D0D0D", label: "Print" },
];

function ShareActions() {
  return (
    <Animated.View entering={FadeIn.duration(500).delay(450)} style={s.wrap}>
      <View style={s.notifyText}>
        <Text style={s.notifyLabel}>Both parties have been notified via email and SMS</Text>
      </View>
      <View style={s.actions}>
        {SHARE_ITEMS.map((item, i) => (
          <ShareCircle key={i} Icon={item.Icon} bg={item.bg} label={item.label} />
        ))}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 22,
  },
  notifyText: {
    alignItems: "center",
    marginBottom: 14,
  },
  notifyLabel: {
    fontSize: 13,
    color: "#4A4A4A",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  item: {
    alignItems: "center",
    gap: 5,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default memo(ShareActions);
