import { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Option = string | { name: string; color?: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  onSelect: (v: string) => void;
  placeholder?: string;
  prefill?: boolean;
};

function ChevronDown({ open }: { open: boolean }) {
  return (
    <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
      <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <Path
          d="M3 5L7 9L11 5"
          stroke="#94A3B8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function DropdownField({
  label,
  value,
  options,
  onSelect,
  placeholder,
  prefill,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) =>
    typeof o === "object" ? o.name === value : o === value
  );

  const handleSelect = useCallback(
    (v: string) => {
      onSelect(v);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <View>
      <View style={s.labelRow}>
        <Text style={s.label}>{label}</Text>
        {prefill && (
          <View style={s.prefillBadge}>
            <Text style={s.prefillBadgeText}>From IMEI</Text>
          </View>
        )}
      </View>

      <Pressable
        style={[s.inputBox, open && s.inputBoxOpen]}
        onPress={() => setOpen(!open)}
      >
        {value && selected && typeof selected === "object" && "color" in selected ? (
          <View style={s.valueRow}>
            <View
              style={[
                s.colorDot,
                { backgroundColor: (selected as { name: string; color: string }).color },
              ]}
            />
            <Text style={s.valueText}>{value}</Text>
          </View>
        ) : (
          <Text style={[s.valueText, !value && s.placeholderText]}>
            {value || placeholder || "Select"}
          </Text>
        )}
        <ChevronDown open={open} />
      </Pressable>

      {open && (
        <View style={s.dropdown}>
          {options.map((opt, i) => {
            const optValue = typeof opt === "string" ? opt : opt.name;
            const active = optValue === value;
            const dotColor = typeof opt === "object" && "color" in opt ? opt.color : undefined;
            return (
              <Pressable
                key={i}
                style={[s.option, active && s.optionActive]}
                onPress={() => handleSelect(optValue)}
              >
                <View style={s.optionRow}>
                  {dotColor && (
                    <View
                      style={[s.optionDot, { backgroundColor: dotColor }]}
                    />
                  )}
                  <Text style={s.optionText}>{optValue}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  prefillBadge: {
    backgroundColor: "#EEF3FF",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  prefillBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1A56FF",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    height: 52,
    paddingHorizontal: 14,
  },
  inputBoxOpen: {
    borderColor: "#1A56FF",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  placeholderText: {
    fontWeight: "400",
    color: "#94A3B8",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 50,
    marginTop: 4,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionActive: {
    backgroundColor: "#EEF3FF",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
});

export default memo(DropdownField);
