import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

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

function DeviceSvg({ color = "#1A56FF", size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x="8" y="2" width="16" height="28" rx="4" stroke={color} strokeWidth="2" fill="none" />
      <Circle cx="16" cy="25" r="1.5" fill={color} />
      <Rect x="12" y="6" width="8" height="1.5" rx="0.75" fill={color} opacity="0.4" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  device: DeviceData;
  selected: boolean;
  onSelect: (id: string) => void;
};

function DeviceMiniCard({ device, selected, onSelect }: Props) {
  return (
    <Pressable onPress={() => onSelect(device.id)} style={[s.card, selected && s.cardSelected]}>
      <View style={[s.check, selected && s.checkSelected]}>
        {selected && <CheckIcon />}
      </View>

      <View style={[s.iconBox, { backgroundColor: device.iconBg }]}>
        <DeviceSvg color={device.iconColor} size={26} />
      </View>
      <Text style={s.name} numberOfLines={1}>{device.name}</Text>
      <Text style={s.model}>{device.model}</Text>
      <View style={s.statusRow}>
        <View style={s.statusDot} />
        <Text style={s.statusLabel}>Active</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexShrink: 0,
    width: 172,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    transform: [{ translateY: -2 }],
  },
  check: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  checkSelected: {
    backgroundColor: "#1A56FF",
    borderColor: "#1A56FF",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D0D0D",
    lineHeight: 17,
    marginBottom: 2,
    paddingRight: 12,
  },
  model: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#16A34A",
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16A34A",
  },
});

export default memo(DeviceMiniCard);
