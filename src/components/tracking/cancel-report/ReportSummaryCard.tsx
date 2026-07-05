import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Device } from "@/types/device";

function DeviceIcon({ color = "#DC2626", size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="18" r="1" fill={color} />
    </Svg>
  );
}

function InfoCircleIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="6" stroke="#DC2626" strokeWidth="1.2" fill="none" />
      <Path d="M7 4V7.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round" />
      <Circle cx="7" cy="10" r="0.6" fill="#DC2626" />
    </Svg>
  );
}

type Props = {
  device: Device;
};

function ReportSummaryCard({ device }: Props) {
  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View style={s.deviceRow}>
          <View style={s.iconBox}>
            <DeviceIcon />
          </View>
          <View style={s.infoWrap}>
            <Text style={s.deviceName}>{device.brand} {device.name}</Text>
            <Text style={s.deviceImei}>IMEI: {device.imei}</Text>
          </View>
        </View>
        <View style={s.stolenBadge}>
          <View style={s.stolenDot} />
          <Text style={s.stolenLabel}>STOLEN</Text>
        </View>
      </View>

      <View style={s.timestampRow}>
        <InfoCircleIcon />
        <Text style={s.timestampText}>
          Reported Stolen: April 28, 2025 · 2:15 PM
        </Text>
      </View>

      <View style={s.warningBox}>
        <Text style={s.warningText}>
          This report is currently active and blocking transfers/verifications
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#DC2626",
    padding: 20,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  deviceRow: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoWrap: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  deviceImei: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  stolenBadge: {
    backgroundColor: "#FEE2E2",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  stolenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DC2626",
  },
  stolenLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  timestampText: {
    fontSize: 13,
    color: "#DC2626",
  },
  warningBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningText: {
    fontSize: 12,
    color: "#991B1B",
    lineHeight: 17,
  },
});

export default memo(ReportSummaryCard);
