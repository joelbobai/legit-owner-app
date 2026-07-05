import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { memo } from "react";

function ShieldWarningIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 9V13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill="#F59E0B" />
    </Svg>
  );
}

function InfoIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
      <Path d="M12 11V17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="7.5" r="1.2" fill="#F59E0B" />
    </Svg>
  );
}

type Props = {
  onInfoPress: () => void;
};

function WarningBanner({ onInfoPress }: Props) {
  return (
    <View style={s.wrapper}>
      <View style={s.banner}>
        <ShieldWarningIcon />
        <View style={s.textWrap}>
          <Text style={s.title}>This action cannot be easily reversed</Text>
          <Text style={s.subtitle}>The device will be flagged as stolen across the platform</Text>
        </View>
        <Pressable onPress={onInfoPress} style={s.infoBtn} hitSlop={8}>
          <InfoIcon />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFBEB",
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    height: 64,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#CA8A04",
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 13,
    color: "#4A4A4A",
    marginTop: 1,
    lineHeight: 17,
  },
  infoBtn: {
    padding: 4,
    flexShrink: 0,
  },
});

export default memo(WarningBanner);
