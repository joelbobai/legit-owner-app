import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  onPress: () => void;
};

function ShieldWarningIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 2L3 5.5V11C3 15.2 6.5 19 11 20.5C15.5 19 19 15.2 19 11V5.5L11 2Z"
        fill="white" opacity="0.2" stroke="white" strokeWidth="1.7"
      />
      <Path d="M11 8.5V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="11" cy="15" r="1.2" fill="white" />
    </Svg>
  );
}

function ReportStolenButton({ onPress }: Props) {
  return (
    <Pressable style={s.btn} onPress={onPress}>
      <ShieldWarningIcon />
      <Text style={s.label}>Report This Device as Stolen</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(ReportStolenButton);
