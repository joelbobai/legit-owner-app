import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function MapLocationModal({ visible, onClose, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <View style={s.headerRow}>
          <Text style={s.headerTitle}>Pin Location on Map</Text>
          <Pressable onPress={onClose} style={s.closeBtn} hitSlop={8}>
            <CloseIcon />
          </Pressable>
        </View>
        <View style={s.mapWrap}>
          <Svg width="100%" height="100%" viewBox="0 0 350 220" preserveAspectRatio="xMidYMid slice">
            <Rect width="350" height="220" fill="#E8EDF5" />
            {[[10, 10, 80, 55], [100, 10, 120, 55], [230, 10, 110, 40], [10, 75, 70, 70], [90, 75, 60, 45], [160, 75, 50, 45], [220, 75, 120, 70], [10, 155, 100, 55], [120, 155, 80, 35], [210, 155, 130, 55]].map(([x, y, w, h], i) => (
              <Rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={i % 3 === 0 ? "#D4D9E8" : i % 3 === 1 ? "#DCE2EE" : "#E2E7F0"} opacity="0.75" />
            ))}
            {[68, 148].map((y, i) => <Rect key={`hr-${i}`} x="0" y={y} width="350" height="7" fill="#F5F7FA" />)}
            {[88, 210].map((x, i) => <Rect key={`vr-${i}`} x={x} y="0" width="7" height="220" fill="#F5F7FA" />)}
            <Rect x="120" y="110" width="70" height="35" rx="4" fill="#C6EDD0" opacity="0.8" />
          </Svg>
          <View style={s.pinWrap}>
            <View style={s.pin} />
          </View>
          <View style={s.hint}>
            <Text style={s.hintText}>Drag to adjust location</Text>
          </View>
        </View>
        <Pressable style={s.confirmBtn} onPress={onConfirm}>
          <Text style={s.confirmText}>Confirm Location</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 100,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  closeBtn: {
    padding: 4,
  },
  mapWrap: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  pinWrap: {
    position: "absolute",
    left: "52%",
    top: "42%",
  },
  pin: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  hint: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: [{ translateX: -65 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  hintText: {
    fontSize: 11,
    color: "white",
  },
  confirmBtn: {
    marginTop: 14,
    width: "100%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(MapLocationModal);
