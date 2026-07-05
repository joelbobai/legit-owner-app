import { memo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  prefill?: boolean;
  keyboardType?: "default" | "number-pad";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

function EditIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M11 2L14 5L5 14H2V11L11 2Z"
        stroke="#1A56FF"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function FloatingInput({
  label,
  value,
  onChangeText,
  placeholder,
  prefill,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "sentences",
}: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  if (prefill) {
    return (
      <Pressable
        style={[s.premiumBox, focused && s.premiumBoxFocused]}
        onPress={() => inputRef.current?.focus()}
      >
        <View style={s.premiumLeft}>
          <Text style={s.premiumLabel}>{label}</Text>
          <Text style={s.premiumValue}>{value || placeholder}</Text>
        </View>

        <View style={s.premiumRight}>
          <View style={s.prefillBadge}>
            <Text style={s.prefillBadgeText}>From IMEI</Text>
          </View>
          <EditIcon />
        </View>

        <TextInput
          ref={inputRef}
          style={s.hiddenInput}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Pressable>
    );
  }

  return (
    <View>
      <View style={[s.inputBox, focused && s.inputBoxFocused]}>
        <TextInput
          style={s.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  premiumBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 68,
    position: "relative",
  },
  premiumBoxFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  premiumLeft: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  premiumLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  premiumValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  premiumRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "center",
  },
  prefillBadge: {
    backgroundColor: "#EEF3FF",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  prefillBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1A56FF",
    letterSpacing: 0.3,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
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
  inputBoxFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    padding: 0,
    height: "100%",
  },
});

export default memo(FloatingInput);
