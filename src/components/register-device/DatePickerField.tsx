import { memo, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Svg, { Path, Rect } from "react-native-svg";

import { formatDisplayDate } from "@/data/deviceFormOptions";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

function CalendarIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Rect
        x="2"
        y="4"
        width="16"
        height="14"
        rx="2"
        stroke="#94A3B8"
        strokeWidth="1.5"
        fill="none"
      />
      <Path d="M2 8H18" stroke="#94A3B8" strokeWidth="1.5" />
      <Path
        d="M6 2V6"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M14 2V6"
        stroke="#94A3B8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function DatePickerField({ value, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const hasValue = Boolean(value);

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${y}-${m}-${d}`);
    }
  };

  const handleDone = () => {
    setShowPicker(false);
  };

  return (
    <View>
      <View style={s.labelRow}>
        <Text style={s.label}>Purchase Date</Text>
      </View>

      <Pressable
        style={[s.inputBox, showPicker && s.inputBoxOpen]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[s.valueText, !hasValue && s.placeholder]}>
          {hasValue ? formatDisplayDate(value) : "Select date"}
        </Text>
        <CalendarIcon />
      </Pressable>

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="fade" onRequestClose={handleDone}>
          <Pressable style={s.modalOverlay} onPress={handleDone}>
            <Pressable style={s.pickerContainer} onPress={() => {}}>
              <View style={s.pickerHeader}>
                <Pressable onPress={handleDone}>
                  <Text style={s.doneBtn}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleChange}
                themeVariant="light"
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={handleChange}
          themeVariant="light"
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  labelRow: {
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
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
  valueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A56FF",
  },
  placeholder: {
    fontWeight: "400",
    color: "#94A3B8",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  doneBtn: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A56FF",
  },
});

export default memo(DatePickerField);
