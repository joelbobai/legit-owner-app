import { memo, useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function CheckBigIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="38" fill="#EEF3FF" stroke="#93C5FD" strokeWidth="2" />
      <Circle cx="40" cy="40" r="28" fill="#1A56FF" fillOpacity="0.12" />
      <Path d="M26 41L35 50L54 30" stroke="#1A56FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CopyIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Rect x="4" y="4" width="8" height="8" rx="1.5" stroke="#1A56FF" strokeWidth="1.3" fill="none" />
      <Path d="M2 10V3C2 2.4 2.4 2 3 2H10" stroke="#1A56FF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function ChevronRightIcon({ color = "white" }) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path d="M6 4L10 8L6 12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type DeviceData = {
  id: string;
  name: string;
  model: string;
  imei: string;
  status: string;
  registered: string;
  iconColor: string;
  iconBg: string;
};

type Props = {
  device: DeviceData;
  onTrackTransfer: () => void;
  onBackToDevices: () => void;
};

function SuccessScreen({ device, onTrackTransfer, onBackToDevices }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const timeline = [
    { num: 1, title: "Buyer notified", desc: "SMS + email sent to Adaeze", done: true },
    { num: 2, title: "Buyer accepts", desc: "Reviews device & verifies identity", done: false, active: true },
    { num: 3, title: "Ownership transferred", desc: "New certificate issued instantly", done: false },
  ];

  return (
    <View style={s.screen}>
      <LinearGradient colors={["#1A56FF", "#0A2ECC"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        <View style={s.decoCircleRight} />
        <View style={s.decoCircleLeft} />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <CheckBigIcon />
        </Animated.View>
        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle}>Request Sent!</Text>
          <Text style={s.headerSub}>
            Adaeze Okoro will be notified to accept ownership of your {device.name}.
          </Text>
        </View>
      </LinearGradient>

      <View style={s.waveWrap}>
        <Svg viewBox="0 0 390 30" width="100%" height={30}>
          <Path d="M0 0 Q97.5 30 195 15 Q292.5 0 390 22 L390 0 Z" fill="#0A2ECC" />
        </Svg>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.transferIdCard}>
          <View>
            <Text style={s.transferIdLabel}>TRANSFER ID</Text>
            <Text style={s.transferIdValue}>TXR-2025-A847C2</Text>
          </View>
          <Pressable style={s.copyBtn}>
            <CopyIcon />
          </Pressable>
        </View>

        <View style={s.timelineCard}>
          <Text style={s.timelineTitle}>What happens next</Text>
          {timeline.map((item, i) => (
            <View key={i} style={[s.timelineRow, i < timeline.length - 1 && s.timelineRowGap]}>
              {i < timeline.length - 1 && <View style={s.timelineLine} />}
              <View style={[s.timelineDot, item.done ? s.timelineDotDone : item.active ? s.timelineDotActive : s.timelineDotPending]}>
                {item.done ? (
                  <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <Path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                ) : (
                  <Text style={[s.timelineNum, item.active && s.timelineNumActive]}>{item.num}</Text>
                )}
              </View>
              <View style={s.timelineTextWrap}>
                <Text style={s.timelineItemTitle}>{item.title}</Text>
                <Text style={s.timelineItemDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={s.primaryBtn} onPress={onTrackTransfer}>
          <Text style={s.primaryText}>Track Transfer Status</Text>
          <ChevronRightIcon color="white" />
        </Pressable>
        <Pressable style={s.secondaryBtn} onPress={onBackToDevices}>
          <Text style={s.secondaryText}>Back to Devices</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: 48,
    paddingBottom: 48,
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  decoCircleRight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  decoCircleLeft: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerTextWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
  },
  waveWrap: {
    marginTop: -1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  transferIdCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transferIdLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  transferIdValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D0D0D",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    position: "relative",
  },
  timelineRowGap: {
    marginBottom: 14,
  },
  timelineLine: {
    position: "absolute",
    left: 15,
    top: 30,
    width: 1.5,
    height: 18,
    backgroundColor: "#E2E8F0",
  },
  timelineDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  timelineDotDone: {
    backgroundColor: "#1A56FF",
  },
  timelineDotActive: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#1A56FF",
  },
  timelineDotPending: {
    backgroundColor: "#F1F5F9",
  },
  timelineNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  timelineNumActive: {
    color: "#1A56FF",
  },
  timelineTextWrap: {
    paddingTop: 4,
  },
  timelineItemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  timelineItemDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
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
  primaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  secondaryBtn: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
});

export default memo(SuccessScreen);
