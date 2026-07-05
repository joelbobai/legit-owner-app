import { memo, useState, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from "react-native-reanimated";
import Svg, { Circle, Path, Defs, Pattern, Rect } from "react-native-svg";
import { QRCode, ShieldLogoSvg } from "./QRCodeSection";

function VerifiedBadge() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14 4.5L17 4.2L17.8 7.2L20.5 8.5L19.8 11.5L21.5 14L19.8 16.5L20.5 19.5L17.8 20.8L17 23.8L14 23.5L12 26L10 23.5L7 23.8L6.2 20.8L3.5 19.5L4.2 16.5L2.5 14L4.2 11.5L3.5 8.5L6.2 7.2L7 4.2L10 4.5L12 2Z"
        fill="#1A56FF"
        transform="scale(0.78) translate(3.4 0)"
      />
      <Path d="M9 12L11.5 14.5L16 10" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WatermarkBackground() {
  const dots: { x: number; y: number }[] = [];
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 20; c++) {
      dots.push({ x: c * 24, y: r * 24 });
    }
  }
  return (
    <View style={s.watermark}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="1" fill="#F1F5F9" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dotPattern)" />
      </Svg>
    </View>
  );
}

function VerifiedStamp() {
  const stampScale = useSharedValue(2);
  const stampOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: "-12deg" }, { scale: stampScale.value }],
    opacity: stampOpacity.value,
  }));

  return (
    <Animated.View style={[s.stamp, animStyle]}>
      <Text style={s.stampVerified}>VERIFIED</Text>
      <ShieldLogoSvg />
      <Text style={s.stampLegit}>LEGIT{"\n"}OWNER</Text>
    </Animated.View>
  );
}

type Props = {
  device: {
    name: string;
    brand: string;
    storage: string;
    imei: string;
    registeredDate: string;
    ownerName: string;
  };
};

function CertificateCard({ device }: Props) {
  const [pressed, setPressed] = useState(false);
  const cardScale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    cardScale.value = withSpring(0.985);
    setPressed(true);
  }, [cardScale]);

  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1);
    setPressed(false);
  }, [cardScale]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    shadowOpacity: pressed ? 0.06 : 0.1,
  }));

  return (
    <Animated.View entering={FadeIn.duration(500).delay(200)} style={[s.card, cardStyle]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={s.pressable}>
        <WatermarkBackground />

        <View style={s.header}>
          <ShieldLogoSvg />
          <View style={s.headerText}>
            <Text style={s.certTitle}>Certificate of Device Ownership</Text>
            <Text style={s.certId}>#LO-20250427-874392</Text>
          </View>
          <View style={s.newBadge}>
            <Text style={s.newBadgeText}>NEW</Text>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.details}>
          {[
            ["Brand", device.brand],
            ["Model", device.name],
            ["Color", "Awesome Black"],
            ["Storage", device.storage],
            ["Registered", device.registeredDate],
          ].map(([k, v], i) => (
            <View key={i} style={s.detailRow}>
              <Text style={s.detailKey}>{k}</Text>
              <Text style={s.detailValue}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={s.ownerSection}>
          <View>
            <Text style={s.ownerLabel}>OWNER</Text>
            <View style={s.ownerRow}>
              <Text style={s.ownerName}>{device.ownerName}</Text>
              <VerifiedBadge />
            </View>
          </View>
          <View style={s.imeiCol}>
            <Text style={s.imeiLabel}>IMEI</Text>
            <Text style={s.imeiValue}>{device.imei}</Text>
          </View>
        </View>

        <View style={s.qrSection}>
          <View style={s.qrWrap}>
            <QRCode size={120} />
          </View>
          <Text style={s.scanLabel}>SCAN TO VERIFY</Text>
        </View>

        <VerifiedStamp />

        <View style={s.tapHint}>
          <Text style={s.tapHintText}>Tap card to view full certificate →</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: 36,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 32,
    elevation: 8,
  },
  pressable: {
    borderRadius: 20,
    padding: 18,
    position: "relative",
    overflow: "hidden",
  },
  watermark: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: "hidden",
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
    zIndex: 1,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.2,
  },
  certId: {
    fontSize: 10.5,
    color: "#94A3B8",
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
  newBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#16A34A",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: "#E2E8F0",
    position: "relative",
    zIndex: 1,
  },
  details: {
    gap: 7,
    position: "relative",
    zIndex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailKey: {
    fontSize: 11.5,
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  ownerSection: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  ownerLabel: {
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 1,
    fontWeight: "600",
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  imeiCol: {
    alignItems: "flex-end",
  },
  imeiLabel: {
    fontSize: 10,
    color: "#1A56FF",
    fontWeight: "600",
    textAlign: "right",
  },
  imeiValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0D0D0D",
    fontVariant: ["tabular-nums"],
  },
  qrSection: {
    marginTop: 12,
    alignItems: "center",
    gap: 6,
    position: "relative",
    zIndex: 1,
  },
  qrWrap: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  scanLabel: {
    fontSize: 10,
    color: "#94A3B8",
    letterSpacing: 1,
    fontWeight: "600",
  },
  stamp: {
    position: "absolute",
    right: -6,
    bottom: 18,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: "#1A56FF",
    backgroundColor: "rgba(238,243,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  stampVerified: {
    fontSize: 8,
    fontWeight: "700",
    color: "#1A56FF",
    letterSpacing: 0.8,
  },
  stampLegit: {
    fontSize: 7,
    fontWeight: "700",
    color: "#1A56FF",
    letterSpacing: 0.6,
    textAlign: "center",
    lineHeight: 8,
    marginTop: 1,
  },
  tapHint: {
    marginTop: 10,
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  tapHintText: {
    fontSize: 10.5,
    color: "#94A3B8",
  },
});

export default memo(CertificateCard);
