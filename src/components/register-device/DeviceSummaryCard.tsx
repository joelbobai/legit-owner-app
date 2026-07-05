import { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { FontFamily } from "@/constants/typography";
import type { DeviceRegistrationData } from "@/context/DeviceRegistrationContext";
import { formatDisplayDate } from "@/data/deviceFormOptions";

type Props = {
  data: DeviceRegistrationData;
};

type InfoRowProps = { label: string; value: string };
function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

const DEVICE_DETAILS = [
  { label: "Brand", key: "brand" as const },
  { label: "Model", key: "model" as const },
  { label: "Color", key: "color" as const },
  { label: "Storage", key: "storage" as const },
  { label: "Condition", key: "condition" as const },
  { label: "Purchase Date", key: "purchaseDate" as const },
];

function conditionLabel(v: string): string {
  if (v === "new") return "New";
  if (v === "good") return "Used — Good";
  if (v === "fair") return "Used — Fair";
  return v || "—";
}

function DeviceIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Rect
        x="8"
        y="2"
        width="16"
        height="28"
        rx="4"
        stroke="#1A56FF"
        strokeWidth="2"
        fill="none"
        opacity="0.15"
      />
      <Rect
        x="8"
        y="2"
        width="16"
        height="28"
        rx="4"
        stroke="#1A56FF"
        strokeWidth="2"
        fill="none"
      />
      <Circle cx="16" cy="25" r="1.5" fill="#1A56FF" />
      <Rect
        x="12"
        y="6"
        width="8"
        height="1.5"
        rx="0.75"
        fill="#1A56FF"
        opacity="0.4"
      />
    </Svg>
  );
}

function DeviceSummaryCard({ data }: Props) {
  const [copied, setCopied] = useState(false);
  const copiedOpacity = useSharedValue(0);

  const maskedIMEI =
    data.imei.length > 10
      ? `${data.imei.slice(0, 10)}••••••`
      : data.imei || "—";

  const handleCopy = useCallback(async () => {
    if (data.imei) {
      await Clipboard.setStringAsync(data.imei);
    }
    setCopied(true);
    copiedOpacity.value = withTiming(1, { duration: 200 });
    setTimeout(() => {
      setCopied(false);
      copiedOpacity.value = withTiming(0, { duration: 200 });
    }, 1800);
  }, [data.imei, copiedOpacity]);

  const getValue = (key: string): string => {
    if (key === "condition") return conditionLabel(data.condition);
    if (key === "purchaseDate")
      return data.purchaseDate
        ? formatDisplayDate(data.purchaseDate)
        : "—";
    if (key === "color") return data.color || "—";
    if (key === "storage") return data.storage || "—";
    return (data as any)[key] || "—";
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(0)}
      style={s.card}
    >
      <View style={s.deviceHeader}>
        <View style={s.iconWrap}>
          <DeviceIcon />
        </View>
        <View style={s.deviceInfo}>
          <Text style={s.deviceName}>
            {data.brand} {data.model}
          </Text>
          <View style={s.imeiRow}>
            <Text style={s.imeiText}>IMEI: {maskedIMEI}</Text>
            <Pressable onPress={handleCopy} hitSlop={8}>
              {copied ? (
                <Text style={s.copiedText}>✓ Copied</Text>
              ) : (
                <Svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                >
                  <Rect
                    x="4.5"
                    y="4.5"
                    width="9"
                    height="9"
                    rx="2"
                    stroke="#1A56FF"
                    strokeWidth="1.3"
                    fill="none"
                  />
                  <Path
                    d="M2.5 10.5V2.5H10.5"
                    stroke="#1A56FF"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <View style={s.detailsGrid}>
        {DEVICE_DETAILS.map((d, i) => (
          <View key={d.key}>
            <InfoRow label={d.label} value={getValue(d.key)} />
            {i < DEVICE_DETAILS.length - 1 && (
              <View style={s.detailDivider} />
            )}
          </View>
        ))}
      </View>

      <View style={s.divider} />

      <View style={s.ownerRow}>
        <Text style={s.ownerLabel}>Current Owner</Text>
        <View style={s.ownerRight}>
          <Text style={s.ownerName}>Chukwuemeka Okoro</Text>
          <View style={s.verifiedBadge}>
            <Svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
            >
              <Path
                d="M8 1.5L2 4V8C2 11 4.7 13.7 8 14.5C11.3 13.7 14 11 14 8V4L8 1.5Z"
                fill="#1A56FF"
                opacity="0.12"
                stroke="#1A56FF"
                strokeWidth="1.2"
              />
              <Path
                d="M5.5 8L7 9.5L10.5 6"
                stroke="#1A56FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={s.verifiedText}>ID Verified</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  deviceHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D0D0D",
    fontFamily: FontFamily.bold,
    letterSpacing: -0.3,
  },
  imeiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 5,
  },
  imeiText: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
  },
  copiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
    fontFamily: FontFamily.bold,
  },
  detailsGrid: {
    gap: 0,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#F8FAFC",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
  },
  infoLabel: {
    fontSize: 13,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
    fontFamily: FontFamily.semibold,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F5FF",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 14,
  },
  ownerLabel: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: FontFamily.regular,
  },
  ownerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ownerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D0D0D",
    fontFamily: FontFamily.bold,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1A56FF",
    fontFamily: FontFamily.bold,
  },
});

export default memo(DeviceSummaryCard);
