import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

function CheckIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="6" fill="#1A56FF" opacity="0.15" />
      <Path
        d="M4.5 7L6.5 9L9.5 5"
        stroke="#1A56FF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type Props = {
  message?: string;
};

function AutoFilledNotice({ message }: Props) {
  return (
    <View style={s.notice}>
      <CheckIcon />
      <Text style={s.text}>
        {message ?? "Brand & model auto-filled from IMEI scan"}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF3FF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: 12,
    color: "#1A56FF",
    fontWeight: "500",
    flex: 1,
  },
});

export default memo(AutoFilledNotice);
