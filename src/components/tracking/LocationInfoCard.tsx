import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Device } from "@/types/device";
import StatusBadge from "./StatusBadge";
import { STATUS_CONFIG } from "@/data/devices";

type Props = {
  device: Device;
};

function PinIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.7 2 6 4.7 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.7 15.3 2 12 2Z" fill="#1A56FF" opacity="0.15" stroke="#1A56FF" strokeWidth="1.8" />
      <Circle cx="12" cy="8" r="2.5" fill="#1A56FF" />
    </Svg>
  );
}

function TimeIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="1.8" fill="none" />
      <Path d="M12 7V12L15.5 14" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function LocationInfoCard({ device }: Props) {
  const config = STATUS_CONFIG[device.status];
  const loc = device.lastKnownLocation;
  return (
    <View style={s.card}>
      <View style={s.top}>
        <Text style={s.title}>{device.name}</Text>
        <StatusBadge config={config} />
      </View>
      {loc && (
        <View style={s.row}>
          <PinIcon />
          <Text style={s.coords}>
            {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
          </Text>
        </View>
      )}
      {device.lastSeen && (
        <View style={s.row}>
          <TimeIcon />
          <Text style={s.lastSeen}>Last seen {device.lastSeen}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coords: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "monospace",
  },
  lastSeen: {
    fontSize: 13,
    color: "#94A3B8",
  },
});
