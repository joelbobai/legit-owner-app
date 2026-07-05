import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

function ShieldWarningIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" fill="#DC2626" fillOpacity="0.12" stroke="#DC2626" strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 9V13" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill="#DC2626" />
    </Svg>
  );
}

const ITEMS = [
  { icon: "🔒", title: "Device flagged platform-wide", desc: "All buyers and sellers will see a stolen alert on this IMEI." },
  { icon: "📡", title: "Authorities notified", desc: "Your report is shared with law enforcement partners automatically." },
  { icon: "🔄", title: "Reversal requires verification", desc: "To unflag, you must submit proof it was recovered and ID verification." },
  { icon: "⚠️", title: "False reports are an offense", desc: "Filing a false stolen report may result in account suspension." },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

function ConsequencesModal({ visible, onClose }: Props) {
  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={s.sheet}>
        <View style={s.handle} />
        <View style={s.header}>
          <ShieldWarningIcon />
          <Text style={s.headerTitle}>What happens when you report?</Text>
        </View>
        <View style={s.list}>
          {ITEMS.map((item, i) => (
            <View key={i} style={s.item}>
              <View style={s.iconWrap}>
                <Text style={s.itemIcon}>{item.icon}</Text>
              </View>
              <View style={s.itemTextWrap}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable style={s.gotItBtn} onPress={onClose}>
          <Text style={s.gotItText}>Got it</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 100,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  list: {
    gap: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemIcon: {
    fontSize: 16,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  itemDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 18,
  },
  gotItBtn: {
    marginTop: 24,
    width: "100%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  gotItText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
});

export default memo(ConsequencesModal);
