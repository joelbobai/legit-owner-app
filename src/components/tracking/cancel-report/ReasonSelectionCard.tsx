import { memo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

type Reason = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const REASONS: Reason[] = [
  {
    id: "recovered",
    label: "Device has been recovered",
    icon: (
      <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <Circle cx="9" cy="9" r="7" stroke="#16A34A" strokeWidth="1.4" fill="none" />
        <Path d="M5.5 9L7.5 11L12.5 6.5" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
  {
    id: "mistake",
    label: "Reported by mistake",
    icon: (
      <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <Path d="M9 4V10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="9" cy="13" r="0.8" fill="#F59E0B" />
      </Svg>
    ),
  },
  {
    id: "other",
    label: "Other (please explain)",
    icon: (
      <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <Circle cx="9" cy="9" r="7" stroke="#1A56FF" strokeWidth="1.4" fill="none" />
        <Path d="M9 7V11" stroke="#1A56FF" strokeWidth="1.4" strokeLinecap="round" />
        <Circle cx="9" cy="5.5" r="0.6" fill="#1A56FF" />
      </Svg>
    ),
  },
];

function CheckCircleIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="7" fill="#1A56FF" />
      <Path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  otherText: string;
  onOtherTextChange: (text: string) => void;
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ReasonSelectionCard({ selectedId, onSelect, otherText, onOtherTextChange }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.title}>Why are you cancelling this report?</Text>
      <View style={s.list}>
        {REASONS.map((r) => {
          const sel = selectedId === r.id;
          return (
            <Pressable key={r.id} onPress={() => onSelect(r.id)} style={[s.option, sel && s.optionSelected]}>
              <View style={s.optionIconWrap}>{r.icon}</View>
              <Text style={[s.optionLabel, sel && s.optionLabelSelected]}>{r.label}</Text>
              {sel && <CheckCircleIcon />}
            </Pressable>
          );
        })}
      </View>

      {selectedId === "other" && (
        <Animated.View entering={FadeIn.duration(200)} style={s.textareaWrap}>
          <Animated.View entering={SlideInDown.duration(250)}>
            <View style={s.textarea}>
              <AnimatedTextInput
                style={s.textareaInput}
                value={otherText}
                onChangeText={onOtherTextChange}
                placeholder="Please provide more details about why you're cancelling this report"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  list: {
    gap: 10,
    marginTop: 14,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  optionSelected: {
    backgroundColor: "#EEF3FF",
    borderColor: "#1A56FF",
  },
  optionIconWrap: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  optionLabelSelected: {
    color: "#1A56FF",
  },
  textareaWrap: {
    marginTop: 12,
  },
  textarea: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F5F7FA",
    padding: 14,
  },
  textareaInput: {
    fontSize: 14,
    color: "#0D0D0D",
    lineHeight: 21,
    minHeight: 60,
    paddingVertical: 0,
  },
});

export default memo(ReasonSelectionCard);
