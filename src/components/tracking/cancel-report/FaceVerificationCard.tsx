import { memo, useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  scanning: boolean;
  verified: boolean;
  onStartScan: () => void;
};

function FaceVerificationCard({ scanning, verified, onStartScan }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanning) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 750, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
        ]),
      );
      pulse.start();

      const spin = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      spin.start();

      return () => {
        pulse.stop();
        spin.stop();
      };
    }
  }, [scanning, pulseAnim, spinAnim]);

  return (
    <View style={s.card}>
      <View style={s.accentLine} />
      <View style={s.content}>
        <View style={s.headerRow}>
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Circle cx="10" cy="10" r="9" stroke="#1A56FF" strokeWidth="1.3" fill="none" />
            <Path d="M10 7V11" stroke="#1A56FF" strokeWidth="1.4" strokeLinecap="round" />
            <Circle cx="10" cy="13.5" r="0.7" fill="#1A56FF" />
          </Svg>
          <Text style={s.title}>Face Verification Required</Text>
        </View>
        <Text style={s.subtitle}>
          To protect your account, we must confirm your identity before cancelling the stolen report
        </Text>

        {verified ? (
          <View style={s.verifiedWrap}>
            <Animated.View
              style={[
                s.verifiedCircle,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <Circle cx="28" cy="28" r="24" fill="#16A34A" />
                <Path d="M17 28L24 35L39 20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Animated.View>
            <Text style={s.verifiedText}>Face Verified Successfully ✅</Text>
          </View>
        ) : scanning ? (
          <View style={s.scanningWrap}>
            <Animated.View
              style={[
                s.scanCircle,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.08],
                        outputRange: [1, 1.06],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: spinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2C6.5 2 2 6.5 2 12" stroke="#1A56FF" strokeWidth="2" strokeLinecap="round" />
                  <Circle cx="12" cy="2" r="1.5" fill="#1A56FF" />
                </Svg>
              </Animated.View>
            </Animated.View>
            <Text style={s.scanningLabel}>Scanning face…</Text>
          </View>
        ) : (
          <Pressable onPress={onStartScan} style={s.startScanWrap}>
            <View style={s.startScanCircle}>
              <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8Z"
                  stroke="#1A56FF" strokeWidth="1.5" fill="none"
                />
                <Path
                  d="M3 6C3 4.9 3.9 4 5 4H8L10 2H14L16 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6Z"
                  stroke="#1A56FF" strokeWidth="1.5" fill="none"
                />
              </Svg>
            </View>
            <Text style={s.startScanLabel}>Tap to start face scan</Text>
            <Text style={s.startScanHint}>Liveness check · Blink detection</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  accentLine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#1A56FF",
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  content: {
    padding: 20,
    position: "relative",
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  subtitle: {
    fontSize: 12,
    color: "#4A4A4A",
    lineHeight: 18,
    marginBottom: 16,
  },
  startScanWrap: {
    alignItems: "center",
    gap: 10,
  },
  startScanCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F7FA",
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
  },
  startScanLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
  },
  startScanHint: {
    fontSize: 11,
    color: "#94A3B8",
  },
  scanningWrap: {
    alignItems: "center",
    gap: 10,
  },
  scanCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F7FA",
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
  },
  scanningLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
  },
  verifiedWrap: {
    alignItems: "center",
    gap: 10,
  },
  verifiedCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 6,
    overflow: "hidden",
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
  },
});

export default memo(FaceVerificationCard);
