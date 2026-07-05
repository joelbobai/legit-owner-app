import { memo, useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

type VerifyState = "valid" | "invalid" | "stolen";

type Props = {
  state: VerifyState | null;
};

function CheckCircle({ size = 32, color = "#16A34A" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="14" fill={color} opacity="0.12" />
      <Circle cx="16" cy="16" r="14" stroke={color} strokeWidth="1.8" />
      <Path d="M10 16L14 20L22 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XCircle({ size = 32, color = "#DC2626" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="14" fill={color} opacity="0.1" />
      <Circle cx="16" cy="16" r="14" stroke={color} strokeWidth="1.8" />
      <Path d="M11 11L21 21M21 11L11 21" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function ShieldWarning({ size = 32, color = "#DC2626" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path d="M16 3L5 8V16C5 22 9.8 27.3 16 29C22.2 27.3 27 22 27 16V8L16 3Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.8" />
      <Path d="M16 12V18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="16" cy="22" r="1.4" fill={color} />
    </Svg>
  );
}

function DeviceInfoRow({ label, value, editable }: { label: string; value: string; editable: boolean }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <View style={s.infoRight}>
        <Text style={[s.infoValue, !editable && s.infoValueDisabled]}>{value}</Text>
        {editable && (
          <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <Path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="#1A56FF" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
          </Svg>
        )}
      </View>
    </View>
  );
}

function VerificationCard({ state }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    if (state) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { stiffness: 200, damping: 20 });
    } else {
      opacity.value = 0;
      translateY.value = -8;
    }
  }, [state, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!state) return null;

  if (state === "valid") {
    return (
      <Animated.View style={[s.validCard, animStyle]}>
        <View style={s.cardRow}>
          <CheckCircle size={32} color="#16A34A" />
          <View style={{ flex: 1 }}>
            <Text style={s.validTitle}>Valid IMEI — Samsung Galaxy A54 detected</Text>
            <View style={s.infoSection}>
              <DeviceInfoRow label="Brand" value="Samsung" editable />
              <DeviceInfoRow label="Model" value="Galaxy A54" editable />
              <DeviceInfoRow label="Manufacture Year" value="2024" editable={false} />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  if (state === "invalid") {
    return (
      <Animated.View style={[s.invalidCard, animStyle]}>
        <View style={s.cardRow}>
          <XCircle size={32} color="#DC2626" />
          <Text style={s.invalidText}>Invalid IMEI — Please check the number and try again</Text>
        </View>
      </Animated.View>
    );
  }

  if (state === "stolen") {
    return (
      <Animated.View style={[s.stolenCard, animStyle]}>
        <View style={s.cardRow}>
          <ShieldWarning size={32} color="#DC2626" />
          <View style={{ flex: 1 }}>
            <Text style={s.stolenTitle}>STOLEN DEVICE DETECTED</Text>
            <Text style={s.stolenDesc}>This device is reported stolen. Registration blocked for security.</Text>
            <Pressable style={s.supportBtn}>
              <Text style={s.supportBtnText}>Contact Support</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  }

  return null;
}

const s = StyleSheet.create({
  validCard: {
    marginTop: 12,
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  invalidCard: {
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  stolenCard: {
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  validTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  infoValueDisabled: {
    color: "#94A3B8",
  },
  invalidText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    lineHeight: 20,
    flex: 1,
  },
  stolenTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
    letterSpacing: 0.3,
  },
  stolenDesc: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 4,
    lineHeight: 18,
  },
  supportBtn: {
    marginTop: 10,
  },
  supportBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
    textDecorationLine: "underline",
    textDecorationColor: "#1A56FF",
    textDecorationStyle: "solid",
  },
});

export default memo(VerificationCard);
