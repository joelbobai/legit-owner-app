import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Clock } from "./DeviceIcons";

type Props = {
  onPress?: () => void;
};

function DeviceHistoryPreview({ onPress }: Props) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.left}>
        <View style={s.iconBox}>
          <Clock size={20} color="#1A56FF" />
        </View>
        <View>
          <Text style={s.title}>View Complete Device History</Text>
          <Text style={s.sub}>Registration · Transfers · Reports</Text>
        </View>
      </View>
      <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path d="M6 4L10 8L6 12" stroke="#1A56FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(26,86,255,0.02)",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A56FF",
  },
  sub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
});

export default memo(DeviceHistoryPreview);
