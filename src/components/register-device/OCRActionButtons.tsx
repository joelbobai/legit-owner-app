import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type Props = {
  onUploadScreenshot?: () => void;
  onTakePhoto?: () => void;
};

function ImageIcon({ color = "#1A56FF" }: { color?: string }) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Rect x="2" y="4" width="18" height="14" rx="2.5" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="7.5" cy="9" r="1.8" fill={color} opacity="0.5" />
      <Path d="M2 15L7 10L11 14L14 11L20 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon({ color = "#1A56FF" }: { color?: string }) {
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Path d="M2 7C2 5.9 2.9 5 4 5H6L8 2H14L16 5H18C19.1 5 20 5.9 20 7V17C20 18.1 19.1 19 18 19H4C2.9 19 2 18.1 2 17V7Z" stroke={color} strokeWidth="1.6" fill="none" />
      <Circle cx="11" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function OCRActionButtons({ onUploadScreenshot, onTakePhoto }: Props) {
  return (
    <View>
      <View style={s.divider}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>OR</Text>
        <View style={s.dividerLine} />
      </View>

      <View style={s.btnRow}>
        <Pressable style={s.ocrBtn} onPress={onUploadScreenshot}>
          <ImageIcon color="#1A56FF" />
          <Text style={s.ocrBtnText}>Upload Screenshot</Text>
        </Pressable>
        <Pressable style={s.ocrBtn} onPress={onTakePhoto}>
          <CameraIcon color="#1A56FF" />
          <Text style={s.ocrBtnText}>Take Photo</Text>
        </Pressable>
      </View>

      <View style={s.ocrHint}>
        <Svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <Path d="M6.5 2L2 5V9C2 10.7 4 12.3 6.5 13C9 12.3 11 10.7 11 9V5L6.5 2Z" stroke="#94A3B8" strokeWidth="1.1" fill="none" />
          <Path d="M4.5 6.5L6 8L9 5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={s.ocrHintText}>IMEI auto-detected from image using OCR</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
  },
  ocrBtn: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  ocrBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
  },
  ocrHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    marginTop: 10,
  },
  ocrHintText: {
    fontSize: 11,
    color: "#94A3B8",
  },
});

export default memo(OCRActionButtons);
