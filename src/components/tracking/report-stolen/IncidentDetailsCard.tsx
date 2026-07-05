import { memo, useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

function CalendarIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="16" rx="3" stroke="#94A3B8" strokeWidth="1.7" fill="none" />
      <Path d="M3 10H21" stroke="#94A3B8" strokeWidth="1.5" />
      <Path d="M8 3V7M16 3V7" stroke="#94A3B8" strokeWidth="1.7" strokeLinecap="round" />
      <Rect x="7" y="13" width="3" height="3" rx="0.8" fill="#94A3B8" />
      <Rect x="11" y="13" width="3" height="3" rx="0.8" fill="#94A3B8" />
    </Svg>
  );
}

function MapPinIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.7 2 6 4.7 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.7 15.3 2 12 2Z" stroke="#94A3B8" strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="8" r="2.5" fill="#94A3B8" fillOpacity="0.5" />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path d="M23 19C23 19.6 22.6 20 22 20H2C1.4 20 1 19.6 1 19V8C1 7.4 1.4 7 2 7H6L8 4H16L18 7H22C22.6 7 23 7.4 23 8V19Z" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function CloseIcon({ size = 16 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function FileIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Path d="M13 2H6C5.4 2 5 2.4 5 3V21C5 21.6 5.4 22 6 22H18C18.6 22 19 21.6 19 21V8L13 2Z" stroke="#16A34A" strokeWidth="1.7" fill="none" />
      <Path d="M13 2V8H19" stroke="#16A34A" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

type Props = {
  dateValue: Date | null;
  dateFocused: boolean;
  description: string;
  descFocused: boolean;
  uploadedFile: string | null;
  onDateChange: (date: Date) => void;
  onDateFocus: () => void;
  onDateBlur: () => void;
  onDescriptionChange: (v: string) => void;
  onDescFocus: () => void;
  onDescBlur: () => void;
  onUploadPress: () => void;
  onRemoveFile: () => void;
  onMapPress: () => void;
};

function IncidentDetailsCard({
  dateValue,
  dateFocused,
  description,
  descFocused,
  uploadedFile,
  onDateChange,
  onDateFocus,
  onDateBlur,
  onDescriptionChange,
  onDescFocus,
  onDescBlur,
  onUploadPress,
  onRemoveFile,
  onMapPress,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDatePick = useCallback((_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  }, [onDateChange]);

  const formattedDate = dateValue
    ? dateValue.toISOString().split("T")[0]
    : "";

  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>Incident Details</Text>

      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>Date of Theft</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[s.field, dateFocused && s.fieldFocused]}
        >
          <CalendarIcon />
          <Text style={[s.fieldText, !formattedDate && s.fieldPlaceholder]}>
            {formattedDate || "Select date"}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={dateValue || new Date()}
            mode="date"
            display="default"
            onChange={handleDatePick}
            maximumDate={new Date()}
          />
        )}
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>Location of Theft</Text>
        <View style={s.locationRow}>
          <View style={s.locationInput}>
            <MapPinIcon />
            <Text style={s.locationText}>Abuja, Nigeria</Text>
          </View>
          <Pressable style={s.pinBtn} onPress={onMapPress}>
            <Text style={s.pinBtnText}>Pin on Map</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>Description</Text>
        <View style={[s.textareaWrap, descFocused && s.textareaFocused]}>
          <TextInput
            style={s.textarea}
            value={description}
            onChangeText={onDescriptionChange}
            onFocus={onDescFocus}
            onBlur={onDescBlur}
            placeholder="Describe what happened (e.g. stolen from car in Wuse Market at 2:15 PM)"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.fieldLabel}>
          Police Report{" "}
          <Text style={s.optionalLabel}>(Optional)</Text>
        </Text>
        {uploadedFile ? (
          <View style={s.filePreview}>
            <View style={s.fileIconWrap}>
              <FileIcon />
            </View>
            <Text style={s.fileName} numberOfLines={1}>
              {uploadedFile}
            </Text>
            <Pressable onPress={onRemoveFile} style={s.removeBtn} hitSlop={8}>
              <CloseIcon size={16} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={s.uploadArea} onPress={onUploadPress}>
            <CameraIcon />
            <View style={s.uploadTextWrap}>
              <Text style={s.uploadTitle}>Upload Police Report or FIR</Text>
              <Text style={s.uploadSub}>PDF, JPG, PNG supported</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 6,
  },
  optionalLabel: {
    fontWeight: "400",
    color: "#94A3B8",
  },
  field: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 14,
    gap: 10,
  },
  fieldFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  fieldText: {
    flex: 1,
    fontSize: 14,
    color: "#0D0D0D",
  },
  fieldPlaceholder: {
    color: "#94A3B8",
  },
  locationRow: {
    flexDirection: "row",
    gap: 8,
    height: 50,
  },
  locationInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    gap: 10,
  },
  locationText: {
    fontSize: 14,
    color: "#0D0D0D",
  },
  pinBtn: {
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  pinBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A56FF",
  },
  textareaWrap: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textareaFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  textarea: {
    fontSize: 14,
    color: "#0D0D0D",
    lineHeight: 22,
    minHeight: 80,
    paddingVertical: 0,
  },
  filePreview: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1FAE5",
    backgroundColor: "#F0FDF4",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fileIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#0D0D0D",
  },
  removeBtn: {
    padding: 4,
  },
  uploadArea: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  uploadTextWrap: {
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  uploadSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },
});

export default memo(IncidentDetailsCard);
