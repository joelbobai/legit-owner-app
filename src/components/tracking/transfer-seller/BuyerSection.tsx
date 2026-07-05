import { memo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import Animated, { FadeIn } from "react-native-reanimated";

function QrCodeIcon({ color = "#1A56FF", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Rect x="3" y="3" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="20" y="3" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="3" y="20" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="6" y="6" width="3" height="3" fill={color} />
      <Rect x="23" y="6" width="3" height="3" fill={color} />
      <Rect x="6" y="23" width="3" height="3" fill={color} />
      <Rect x="17" y="17" width="3" height="3" fill={color} />
      <Rect x="22" y="17" width="3" height="3" fill={color} />
      <Rect x="17" y="22" width="3" height="3" fill={color} />
      <Rect x="26" y="22" width="3" height="3" fill={color} />
      <Rect x="22" y="26" width="3" height="3" fill={color} />
      <Rect x="26" y="26" width="3" height="3" fill={color} />
    </Svg>
  );
}

function ShieldSmIcon({ color = "#16A34A" }) {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <Path d="M8.5 12L11 14.5L15.5 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckSmallIcon() {
  return (
    <Svg width="10" height="10" viewBox="0 0 12 12" fill="none">
      <Path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  buyerInput: string;
  buyerVerified: boolean;
  onInputChange: (v: string) => void;
  onScanQR: () => void;
};

function BuyerSection({ buyerInput, buyerVerified, onInputChange, onScanQR }: Props) {
  const [focused, setFocused] = useState(false);

  if (buyerVerified) {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={s.verifiedCard}>
        <View style={s.verifiedBadge}>
          <CheckSmallIcon />
          <Text style={s.verifiedBadgeText}>VERIFIED</Text>
        </View>

        <View style={s.verifiedContent}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>AO</Text>
          </View>
          <View style={s.verifiedInfo}>
            <Text style={s.verifiedLabel}>BUYER</Text>
            <Text style={s.verifiedName}>Adaeze Okoro</Text>
            <Text style={s.verifiedContact}>+234 801 234 5678</Text>
            <View style={s.kycRow}>
              <ShieldSmIcon />
              <Text style={s.kycText}>Account verified · KYC complete</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View>
      <View style={[s.inputWrap, focused && s.inputFocused]}>
        <TextInput
          style={s.input}
          value={buyerInput}
          onChangeText={onInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder=""
        />
        <Text style={[s.floatingLabel, (focused || buyerInput.length > 0) && s.floatingLabelUp, focused && s.floatingLabelFocused]}>
          {focused || buyerInput.length > 0 ? "BUYER'S PHONE OR EMAIL" : "Buyer&apos;s phone number or email"}
        </Text>
      </View>

      <View style={s.orRow}>
        <View style={s.orLine} />
        <Text style={s.orText}>OR</Text>
        <View style={s.orLine} />
      </View>

      <Pressable onPress={onScanQR} style={s.qrBtn}>
        <QrCodeIcon size={24} color="#1A56FF" />
        <Text style={s.qrBtnText}>Scan Buyer&apos;s QR Code</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  inputWrap: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    justifyContent: "center",
    position: "relative",
  },
  inputFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    fontSize: 14,
    color: "#0D0D0D",
    paddingTop: 14,
    height: 56,
    paddingVertical: 0,
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "400",
    top: 18,
  },
  floatingLabelUp: {
    fontSize: 10,
    fontWeight: "600",
    top: 8,
    letterSpacing: 0.8,
  },
  floatingLabelFocused: {
    color: "#1A56FF",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  orText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  qrBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "hidden",
  },
  qrBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A56FF",
  },
  verifiedCard: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    padding: 14,
    position: "relative",
  },
  verifiedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#1A56FF",
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.3,
  },
  verifiedContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  verifiedInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 60,
  },
  verifiedLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1.5,
  },
  verifiedName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
    marginTop: 1,
  },
  verifiedContact: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    fontVariant: ["tabular-nums"],
  },
  kycRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  kycText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
});

export default memo(BuyerSection);
