import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Device } from "@/types/device";
import InfoRow from "./InfoRow";

type Props = {
  device: Device;
  onCopyImei?: () => void;
};

function DeviceInfoCard({ device, onCopyImei }: Props) {
  return (
    <View style={s.card}>
      <View style={s.titleRow}>
        <Text style={s.deviceName}>{device.name}</Text>
        <Text style={s.deviceMeta}>
          {device.os === "Android 14" || device.os === "Android 13"
            ? "5G"
            : "5G"}{" "}
          · {device.os} · {device.storage}
        </Text>
      </View>

      <View style={s.divider} />

      <View style={s.infoSection}>
        <InfoRow label="Brand" value={device.brand} />
        <View style={s.infoDivider} />
        <InfoRow label="Category" value={device.category} />
        <View style={s.infoDivider} />
        <InfoRow label="IMEI" value={device.imei} onCopy={onCopyImei} />
        <View style={s.infoDivider} />
        <InfoRow label="Serial Number" value={device.serialNumber} />
        <View style={s.infoDivider} />
        <InfoRow label="Registration" value={device.registeredDate} />
        <View style={s.infoDivider} />
        <InfoRow label="Purchase Date" value={device.purchaseDate} />
        <View style={s.infoDivider} />
        <InfoRow label="Color" value={device.color} />
        <View style={s.infoDivider} />
        <InfoRow label="Storage" value={device.storage} />
        <View style={s.infoDivider} />
        <InfoRow label="Condition" value={device.condition} />
      </View>

      <View style={s.ownerDivider} />

      <View style={s.ownerRow}>
        <Text style={s.ownerLabel}>Current Owner</Text>
        <View style={s.ownerRight}>
          <Text style={s.ownerName}>{device.ownerName}</Text>
          <View style={s.ownerCheck}>
            <Svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <Path
                d="M2 5.5L4.5 8L9 3"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  titleRow: {
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.4,
  },
  deviceMeta: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },
  infoSection: {},
  infoDivider: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginVertical: 2,
  },
  ownerDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F5FF",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  ownerLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  ownerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  ownerCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default memo(DeviceInfoCard);
