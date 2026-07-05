import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CopyIcon } from "@/components/Icon";
import { CheckCircle } from "./DeviceIcons";

type Props = {
  label: string;
  value: string;
  onCopy?: () => void;
  verified?: boolean;
};

function InfoRow({ label, value, onCopy, verified }: Props) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <View style={s.right}>
        <Text style={s.value} numberOfLines={1}>{value}</Text>
        {verified && <CheckCircle size={14} color="#16A34A" />}
        {onCopy && (
          <Pressable onPress={onCopy} hitSlop={8} style={s.copyBtn}>
            <CopyIcon size={16} color="#1A56FF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 36,
  },
  label: {
    fontSize: 13,
    color: "#94A3B8",
    flexShrink: 0,
    minWidth: 100,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "flex-end",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    textAlign: "right",
  },
  copyBtn: {
    marginLeft: 2,
  },
});

export default memo(InfoRow);
