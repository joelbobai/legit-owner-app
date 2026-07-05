import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { Device } from "@/types/device";

function DeviceIcon({ color = "#94A3B8", size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="18" r="1.3" fill={color} />
    </Svg>
  );
}

function OnlineDot({ active, online }: { active: boolean; online: boolean }) {
  const dotColor = !online
    ? active ? "rgba(255,255,255,0.4)" : "#CBD5E1"
    : active ? "#4ADE80" : "#16A34A";
  return <View style={[s.dot, { backgroundColor: dotColor }]} />;
}

type DevicePillProps = {
  device: Device;
  active: boolean;
  onPress: () => void;
};

function DevicePill({ device, active, onPress }: DevicePillProps) {
  const isOnline = device.status === "active";
  const tint = active ? "white" : "#0D0D0D";
  const subtitleColor = active ? "rgba(255,255,255,0.7)" : "#94A3B8";

  return (
    <Pressable onPress={onPress}>
      <View style={[s.pill, active && s.pillActive, !active && s.pillInactive]}>
        <DeviceIcon color={tint} size={15} />
        <View>
          <Text style={[s.pillBrand, { color: tint }]}>{device.brand}</Text>
          <Text style={[s.pillModel, { color: subtitleColor }]}>{device.name}</Text>
        </View>
        <OnlineDot active={active} online={isOnline} />
      </View>
    </Pressable>
  );
}

const MemoPill = memo(DevicePill);

type ToggleMode = "devices" | "imei";

type Props = {
  devices: Device[];
  selectedId: string;
  imeiMode: boolean;
  imeiValue: string;
  imeiVerified: boolean;
  imeiFocused: boolean;
  onSelectDevice: (id: string) => void;
  onToggleMode: (mode: ToggleMode) => void;
  onImeiChange: (v: string) => void;
  onImeiFocus: () => void;
  onImeiBlur: () => void;
  onVerifyImei: () => void;
};

function DeviceSelectorCard({
  devices,
  selectedId,
  imeiMode,
  imeiValue,
  imeiVerified,
  imeiFocused,
  onSelectDevice,
  onToggleMode,
  onImeiChange,
  onImeiFocus,
  onImeiBlur,
  onVerifyImei,
}: Props) {
  const selectedDevice = devices.find((d) => d.id === selectedId);

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>Which device was stolen?</Text>

      <View style={s.segment}>
        <Pressable
          onPress={() => onToggleMode("devices")}
          style={[s.segmentOpt, !imeiMode && s.segmentActive]}
        >
          <Text style={[s.segmentLabel, !imeiMode ? s.segmentActiveLabel : s.segmentInactiveLabel]}>
            My Devices
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onToggleMode("imei")}
          style={[s.segmentOpt, imeiMode && s.segmentActive]}
        >
          <Text style={[s.segmentLabel, imeiMode ? s.segmentActiveLabel : s.segmentInactiveLabel]}>
            Enter IMEI
          </Text>
        </Pressable>
      </View>

      {!imeiMode ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.pillsRow}
        >
          {devices.map((d) => (
            <MemoPill
              key={d.id}
              device={d}
              active={d.id === selectedId}
              onPress={() => onSelectDevice(d.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={s.imeiRow}>
          <View style={[s.imeiInputWrap, imeiFocused && s.imeiInputFocused]}>
            <DeviceIcon color="#94A3B8" size={16} />
            <TextInput
              style={s.imeiInput}
              value={imeiValue}
              onChangeText={onImeiChange}
              onFocus={onImeiFocus}
              onBlur={onImeiBlur}
              placeholder="Enter 15-digit IMEI"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={15}
            />
          </View>
          <Pressable
            onPress={onVerifyImei}
            disabled={imeiValue.length !== 15}
            style={[s.verifyBtn, imeiValue.length === 15 ? s.verifyBtnActive : s.verifyBtnDisabled]}
          >
            <Text style={[s.verifyLabel, imeiValue.length === 15 ? s.verifyLabelActive : s.verifyLabelDisabled]}>
              {imeiVerified ? "✓ OK" : "Verify"}
            </Text>
          </Pressable>
        </View>
      )}

      {!imeiMode && selectedDevice && (
        <View style={s.preview}>
          <View style={s.previewIcon}>
            <DeviceIcon color="#1A56FF" size={18} />
          </View>
          <View style={s.previewInfo}>
            <Text style={s.previewName}>
              {selectedDevice.brand} {selectedDevice.name}
            </Text>
            <Text style={s.previewImei}>IMEI: {selectedDevice.imei}</Text>
          </View>
          <View style={s.previewBadge}>
            <View style={[s.previewDot, { backgroundColor: selectedDevice.status === "active" ? "#16A34A" : "#94A3B8" }]} />
            <Text style={[s.previewStatus, { color: selectedDevice.status === "active" ? "#16A34A" : "#64748B" }]}>
              {selectedDevice.status === "active" ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 14,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
    gap: 3,
  },
  segmentOpt: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  segmentActiveLabel: {
    color: "#0D0D0D",
  },
  segmentInactiveLabel: {
    color: "#94A3B8",
  },
  pillsRow: {
    gap: 8,
    paddingBottom: 2,
  },
  pill: {
    flexShrink: 0,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pillActive: {
    backgroundColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  pillInactive: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  pillBrand: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  pillModel: {
    fontSize: 10,
    lineHeight: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  imeiRow: {
    flexDirection: "row",
    gap: 8,
  },
  imeiInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    gap: 8,
  },
  imeiInputFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  imeiInput: {
    flex: 1,
    fontSize: 14,
    color: "#0D0D0D",
    paddingVertical: 0,
    height: 48,
  },
  verifyBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyBtnActive: {
    backgroundColor: "#1A56FF",
  },
  verifyBtnDisabled: {
    backgroundColor: "#E2E8F0",
  },
  verifyLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  verifyLabelActive: {
    color: "white",
  },
  verifyLabelDisabled: {
    color: "#94A3B8",
  },
  preview: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF3FF",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  previewImei: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF3FF",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default memo(DeviceSelectorCard);
