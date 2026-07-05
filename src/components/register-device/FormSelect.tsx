import { memo, useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Option = { label: string; value: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  onSelect: (v: string) => void;
  placeholder?: string;
};

function ChevronDown() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path d="M4 6L8 10L12 6" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Path d="M4 9L7.5 12.5L14 6" stroke="#1A56FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FormSelect({ label, value, options, onSelect, placeholder }: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);
  const display = selected ? selected.label : placeholder || "Select";

  const handleSelect = useCallback(
    (v: string) => {
      onSelect(v);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <>
      <Pressable style={s.wrapper} onPress={() => setOpen(true)}>
        <Text style={s.label}>{label}</Text>
        <View style={s.row}>
          <Text style={[s.value, !selected && s.placeholder]}>
            {display}
          </Text>
          <ChevronDown />
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <View style={s.sheet}>
            <View style={s.handle} />
            <Text style={s.sheetTitle}>{label}</Text>
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <Pressable
                  key={opt.value}
                  style={[s.option, active && s.optionActive]}
                  onPress={() => handleSelect(opt.value)}
                >
                  <Text style={[s.optionText, active && s.optionTextActive]}>
                    {opt.label}
                  </Text>
                  {active && <CheckIcon />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 28,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D0D0D",
  },
  placeholder: {
    color: "#CBD5E1",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D0D0D",
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionActive: {
    backgroundColor: "#EEF3FF",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D0D0D",
  },
  optionTextActive: {
    color: "#1A56FF",
    fontWeight: "600",
  },
});

export default memo(FormSelect);
