import { View, Text, StyleSheet } from "react-native";
import { StatusConfig } from "@/types/device";

type Props = {
  config: StatusConfig;
};

export default function StatusBadge({ config }: Props) {
  return (
    <View style={[s.badge, { backgroundColor: config.bg }]}>
      <View style={[s.dot, { backgroundColor: config.dot }]} />
      <Text style={[s.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
