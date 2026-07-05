import { memo, useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

function TransferArrowsIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path d="M20 8L26 14L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M26 14H10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M12 24L6 18L12 12" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M6 18H22" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

type Props = {
  sellerName: string;
  expiresInMinutes?: number;
};

function TransferNotificationBanner({ sellerName, expiresInMinutes = 48 }: Props) {
  const [timeLeft, setTimeLeft] = useState(expiresInMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#1A56FF", "#0A2ECC"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.banner}>
      <View style={s.content}>
        <View style={s.row}>
          <TransferArrowsIcon />
          <View style={s.textWrap}>
            <Text style={s.title}>Transfer Request</Text>
            <Text style={s.message}>
              {sellerName} wants to transfer ownership of this device to you.
            </Text>
          </View>
        </View>
        <View style={s.timer}>
          <ClockIcon />
          <Text style={s.timerText}>Expires in {formatTime(timeLeft)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  banner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  message: {
    fontSize: 12.5,
    color: "rgba(255,255,255,0.85)",
    marginTop: 3,
    lineHeight: 18,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
});

export default memo(TransferNotificationBanner);
