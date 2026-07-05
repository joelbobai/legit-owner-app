import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { Device, StatusConfig } from "@/types/device";
import { ShieldCheckIcon } from "@/components/Icon";
import { DeviceMobile } from "./DeviceIcons";

type Props = {
  device: Device;
  statusConfig: StatusConfig;
  onBack: () => void;
  onAddPhoto?: () => void;
};

function DeviceHero({ device, statusConfig, onBack, onAddPhoto }: Props) {
  return (
    <View style={s.heroOuter}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="heroDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <Circle cx="1.5" cy="1.5" r="1.5" fill="rgba(26,86,255,0.06)" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#heroDots)" />
      </Svg>
      <View style={s.heroCircleTR} pointerEvents="none" />
      <View style={s.heroCircleBL} pointerEvents="none" />

      <View style={[s.statusBadge, { backgroundColor: statusConfig.bg }]}>
        <View style={[s.statusDot, { backgroundColor: statusConfig.dot }]} />
        <Text style={[s.statusText, { color: statusConfig.text }]}>{statusConfig.label}</Text>
      </View>

      <View style={s.verifiedBadge}>
        <ShieldCheckIcon size={14} color="#1A56FF" />
        <Text style={s.verifiedText}>Verified Owner</Text>
      </View>

      <View style={s.heroIllust}>
        <DeviceMobile size={90} color="#1A56FF" />
        <Pressable style={s.addPhotoBtn} onPress={onAddPhoto}>
          <Text style={s.addPhotoText}>+ Add photo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  heroOuter: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#EEF3FF",
    minHeight: 220,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  heroCircleTR: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(26,86,255,0.06)",
  },
  heroCircleBL: {
    position: "absolute",
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(26,86,255,0.04)",
  },
  statusBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 2,
  },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 12, fontWeight: "700" },
  verifiedBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  verifiedText: { fontSize: 11, fontWeight: "700", color: "#1A56FF" },
  heroIllust: {
    alignItems: "center",
    gap: 10,
  },
  addPhotoBtn: {
    borderWidth: 1,
    borderColor: "rgba(26,86,255,0.3)",
    borderStyle: "dashed",
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: "rgba(26,86,255,0.06)",
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A56FF",
  },
});

export default memo(DeviceHero);
