import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function CheckIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M5 12L10 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  checked: boolean;
  onToggle: () => void;
};

function LegalCheckbox({ checked, onToggle }: Props) {
  return (
    <View style={s.row}>
      <Pressable onPress={onToggle} style={[s.box, checked && s.boxChecked]} hitSlop={8}>
        {checked && <CheckIcon />}
      </Pressable>
      <Text style={s.text}>
        I confirm this device was stolen from me and all information provided is accurate.{" "}
        <Text style={s.link}>View legal terms</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 4,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    flexShrink: 0,
    marginTop: 1,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 21,
    flex: 1,
  },
  link: {
    color: "#1A56FF",
    fontWeight: "600",
  },
});

export default memo(LegalCheckbox);
