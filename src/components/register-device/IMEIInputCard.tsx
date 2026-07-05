import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withSpring } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

type VerifyState = "idle" | "loading" | "valid" | "invalid" | "stolen";

type Props = {
  digits: string;
  onChangeDigits: (d: string) => void;
  verifyState: VerifyState;
  onVerify: () => void;
};

function formatIMEI(digits: string): string {
  const groups = [4, 4, 4, 3];
  let result = "";
  let pos = 0;
  for (let i = 0; i < groups.length; i++) {
    const chunk = digits.slice(pos, pos + groups[i]);
    if (!chunk) break;
    if (i > 0) result += "-";
    result += chunk;
    pos += groups[i];
  }
  return result;
}

function CheckSmIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="8" stroke="#1A56FF" strokeWidth="1.4" />
      <Path d="M5.5 9L7.5 11L12.5 7" stroke="#1A56FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IMEIInputCard({ digits, onChangeDigits, verifyState, onVerify }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isComplete = digits.length === 15;
  const displayValue = digits ? formatIMEI(digits) : "";

  const shakeTranslate = useSharedValue(0);

  useEffect(() => {
    if (verifyState === "invalid" || verifyState === "stolen") {
      shakeTranslate.value = withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(-3, { duration: 50 }),
        withTiming(3, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [verifyState, shakeTranslate]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslate.value }],
  }));

  const handleChange = useCallback(
    (text: string) => {
      const filtered = text.replace(/\D/g, "").slice(0, 15);
      onChangeDigits(filtered);
    },
    [onChangeDigits]
  );

  const displayColor =
    verifyState === "valid"
      ? "#16A34A"
      : verifyState === "invalid" || verifyState === "stolen"
      ? "#DC2626"
      : "#0D0D0D";

  return (
    <Animated.View
      style={[
        s.card,
        focused && s.cardFocused,
        shakeStyle,
      ]}
    >
      <View style={s.header}>
        <Text style={s.label}>IMEI Number (15 digits)</Text>
        <Text
          style={[
            s.counter,
            isComplete && s.counterComplete,
            digits.length > 0 && !isComplete && s.counterActive,
          ]}
        >
          {digits.length}/15
        </Text>
      </View>

      <Pressable style={s.inputArea} onPress={() => inputRef.current?.focus()}>
        <TextInput
          ref={inputRef}
          style={s.hiddenInput}
          value={digits}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={15}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <View style={s.inputDisplay}>
          {displayValue ? (
            <Text style={[s.inputText, { color: displayColor }]}>
              {displayValue}
              {focused && digits.length < 15 && (
                <Text style={s.cursor}>|</Text>
              )}
            </Text>
          ) : (
            <Text style={s.placeholder}>···· ···· ···· ···</Text>
          )}
        </View>
      </Pressable>

      <Pressable
        style={[
          s.verifyBtn,
          isComplete && verifyState !== "loading" && s.verifyBtnReady,
        ]}
        onPress={onVerify}
        disabled={!isComplete || verifyState === "loading"}
      >
        {verifyState === "loading" ? (
          <>
            <View style={s.spinner} />
            <Text style={s.verifyBtnTextDisabled}>Verifying…</Text>
          </>
        ) : (
          <>
            <CheckSmIcon />
            <Text
              style={[
                s.verifyBtnText,
                isComplete && s.verifyBtnTextReady,
              ]}
            >
              Verify IMEI
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardFocused: {
    borderColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: "#1A56FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  counter: {
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  counterActive: {
    color: "#1A56FF",
  },
  counterComplete: {
    color: "#16A34A",
  },
  inputArea: {
    position: "relative",
    height: 72,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    fontSize: 24,
  },
  inputDisplay: {
    height: 72,
    backgroundColor: "#F8FAFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 4,
    fontVariant: ["tabular-nums"],
  },
  cursor: {
    fontSize: 22,
    fontWeight: "300",
    color: "#1A56FF",
  },
  placeholder: {
    fontSize: 20,
    fontWeight: "700",
    color: "#CBD5E1",
    letterSpacing: 4,
  },
  verifyBtn: {
    height: 52,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: "#F8FAFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  verifyBtnReady: {
    borderColor: "#1A56FF",
    backgroundColor: "white",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  verifyBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  verifyBtnTextReady: {
    color: "#1A56FF",
  },
  verifyBtnTextDisabled: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderTopColor: "#1A56FF",
  },
});

export default memo(IMEIInputCard);
