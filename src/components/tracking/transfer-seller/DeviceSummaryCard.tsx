import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import Animated, { FadeIn } from "react-native-reanimated";

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

function DeviceIcon({ color = "#1A56FF", size = 30 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x="8" y="2" width="16" height="28" rx="4" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="16" cy="25" r="1.5" fill={color} />
      <Rect x="12" y="6" width="8" height="1.5" rx="0.75" fill={color} opacity="0.4" />
    </Svg>
  );
}

function CheckCircleIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#16A34A" />
      <Path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
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

function CalendarIcon() {
  return (
    <Svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <Rect x="1" y="3" width="12" height="10" rx="1.5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
      <Path d="M4 1V3M10 1V3M1 6H13" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function InfoCircleIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#1A56FF" strokeWidth="1.6" fill="none" />
      <Path d="M12 11V17" stroke="#1A56FF" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="7.5" r="1.2" fill="#1A56FF" />
    </Svg>
  );
}

type Props = {
  device: DeviceData;
};

function DeviceSummaryCard({ device }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={s.wrap}>
      <View style={s.row}>
        <View style={s.iconWrap}>
          <DeviceIcon color={device.iconColor} size={30} />
          <View style={s.badge}>
            <CheckCircleIcon />
          </View>
        </View>
        <View style={s.info}>
          <Text style={s.name}>{device.name}</Text>
          <View style={s.imeiRow}>
            <Text style={s.imei}>IMEI: {device.imei}</Text>
            <CopyIcon />
          </View>
          <View style={s.metaRow}>
            <View style={s.activeBadge}>
              <View style={s.activeDot} />
              <Text style={s.activeLabel}>ACTIVE</Text>
            </View>
            <CalendarIcon />
            <Text style={s.regText}>Registered {device.registered}</Text>
          </View>
        </View>
      </View>
      <View style={s.helperBox}>
        <View style={s.helperIconWrap}><InfoCircleIcon /></View>
        <Text style={s.helperText}>
          Transfer will update ownership instantly and issue a new certificate to the buyer.
        </Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    position: "relative",
  },
  badge: {
    position: "absolute",
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  imeiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  imei: {
    fontSize: 12,
    color: "#64748B",
    fontVariant: ["tabular-nums"],
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  activeBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#16A34A",
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  regText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  helperBox: {
    marginTop: 12,
    backgroundColor: "#EEF3FF",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  helperIconWrap: {
    marginTop: 1,
    flexShrink: 0,
  },
  helperText: {
    fontSize: 11.5,
    color: "#1E40AF",
    lineHeight: 17,
    flex: 1,
  },
});

export default memo(DeviceSummaryCard);
