import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  value: boolean;
  onChange: () => void;
};

function AlertToggle({ value, onChange }: Props) {
  return (
    <Pressable onPress={onChange} style={[s.track, value && s.trackActive]}>
      <View style={[s.thumb, value && s.thumbActive]} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  trackActive: {
    backgroundColor: "#1A56FF",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  thumbActive: {
    alignSelf: "flex-end",
  },
});

export default memo(AlertToggle);
