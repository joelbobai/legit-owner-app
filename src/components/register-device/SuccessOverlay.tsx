import { memo, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { FontFamily } from "@/constants/typography";

type Props = {
  visible: boolean;
  deviceName: string;
  totalPaid: number;
  onDone: () => void;
};

const { width: SW } = Dimensions.get("window");

function SuccessOverlay({ visible, deviceName, totalPaid, onDone }: Props) {
  const [step, setStep] = useState(0);
  const ringScale = useSharedValue(0);
  const checkStroke = useSharedValue(60);

  useEffect(() => {
    if (!visible) {
      setStep(0);
      ringScale.value = 0;
      checkStroke.value = 60;
      return;
    }

    ringScale.value = withSpring(1, { stiffness: 120, damping: 12 });
    const t1 = setTimeout(() => setStep(1), 300);
    const t2 = setTimeout(() => {
      checkStroke.value = withTiming(0, { duration: 400 });
      setStep(2);
    }, 700);
    const t3 = setTimeout(() => setStep(3), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [visible, ringScale, checkStroke]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <View style={s.content}>
        <Animated.View style={[s.ringWrap, ringStyle]}>
          <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <Circle cx="60" cy="60" r="54" fill="#F0FDF4" stroke="#16A34A" strokeWidth="3" />
            {step >= 1 && (
              <Path
                d="M36 60L52 76L84 44"
                stroke="#16A34A"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="60"
                strokeDashoffset={step >= 2 ? 0 : 60}
                opacity={step >= 2 ? 1 : 0}
              />
            )}
          </Svg>
        </Animated.View>

        {step >= 2 && (
          <Animated.View entering={FadeIn.duration(400)} style={s.textBlock}>
            <Text style={s.heading}>Registration Successful!</Text>
            <Text style={s.sub}>
              {deviceName} has been registered and your ownership
              certificate is ready.
            </Text>

            <View style={s.infoCards}>
              <View style={s.infoCard}>
                <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <Circle cx="9" cy="9" r="8" fill="#16A34A" opacity="0.15" />
                  <Path
                    d="M5.5 9L7.5 11L12.5 7"
                    stroke="#16A34A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={s.infoCardText}>
                  ₦{totalPaid} payment confirmed
                </Text>
              </View>
              <View style={[s.infoCard, s.infoCardBlue]}>
                <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <Rect
                    x="2"
                    y="2"
                    width="14"
                    height="12"
                    rx="2"
                    stroke="#1A56FF"
                    strokeWidth="1.4"
                    fill="none"
                  />
                  <Path
                    d="M5 8H13M5 11H9"
                    stroke="#1A56FF"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={[s.infoCardText, { color: "#1A56FF" }]}>
                  Certificate ready to download
                </Text>
              </View>
            </View>

            <Pressable style={s.doneBtn} onPress={onDone}>
              <LinearGradient
                colors={["#1A56FF", "#0A2ECC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.doneBtnGrad}
              >
                <Text style={s.doneBtnText}>View My Device</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 46,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  ringWrap: {
    width: 120,
    height: 120,
  },
  textBlock: {
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0D0D0D",
    fontFamily: FontFamily.bold,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  sub: {
    fontSize: 14,
    color: "#4A4A4A",
    fontFamily: FontFamily.regular,
    marginTop: 8,
    lineHeight: 22,
    textAlign: "center",
  },
  infoCards: {
    marginTop: 16,
    gap: 10,
    width: "100%",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 16,
  },
  infoCardBlue: {
    backgroundColor: "#EEF3FF",
  },
  infoCardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
    fontFamily: FontFamily.semibold,
  },
  doneBtn: {
    marginTop: 20,
    width: "100%",
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  doneBtnGrad: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    fontFamily: FontFamily.semibold,
  },
});

export default memo(SuccessOverlay);
