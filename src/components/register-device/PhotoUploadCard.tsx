import { memo, useCallback, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, { Path } from "react-native-svg";

export const PHOTO_LABELS = ["Front", "Back", "Left", "Right", "Receipt", "Box"] as const;

type PhotoSlotProps = {
  label: string;
  uri: string | null;
  index: number;
  onPick: (i: number) => void;
  onRemove: (i: number) => void;
};

function CameraIcon() {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8Z"
        stroke="#94A3B8"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M3 6C3 4.9 3.9 4 5 4H8L10 2H14L16 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6Z"
        stroke="#94A3B8"
        strokeWidth="1.5"
        fill="none"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M3 8L6 11L13 4"
        stroke="#1A56FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path
        d="M2 2L8 8M8 2L2 8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PhotoSlot({ label, uri, index, onPick, onRemove }: PhotoSlotProps) {
  const hasPhoto = uri != null;

  return (
    <View style={s.slotCol}>
      <Pressable
        style={[s.slot, hasPhoto && s.slotFilled]}
        onPress={() => !hasPhoto && onPick(index)}
      >
        {hasPhoto ? (
          <>
            <Image source={{ uri }} style={s.slotImage} />
            <View style={s.checkBadge}>
              <CheckIcon />
            </View>
            <Pressable
              style={s.removeBtn}
              onPress={() => onRemove(index)}
              hitSlop={8}
            >
              <XIcon />
            </Pressable>
          </>
        ) : (
          <>
            <CameraIcon />
            <Text style={s.slotIconLabel}>Tap</Text>
          </>
        )}
      </Pressable>
      <Text style={s.slotLabel}>{label}</Text>
    </View>
  );
}

type Props = {
  photos: (string | null)[];
  onAdd: (i: number, uri: string) => void;
  onRemove: (i: number) => void;
};

function PhotoUploadCard({ photos, onAdd, onRemove }: Props) {
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);

  const handleGallery = useCallback(async () => {
    if (pickerIndex == null) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images" as any],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onAdd(pickerIndex, result.assets[0].uri);
    }
    setPickerIndex(null);
  }, [pickerIndex, onAdd]);

  const handleCamera = useCallback(async () => {
    if (pickerIndex == null) return;
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      setPickerIndex(null);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onAdd(pickerIndex, result.assets[0].uri);
    }
    setPickerIndex(null);
  }, [pickerIndex, onAdd]);

  const handlePick = useCallback((i: number) => {
    setPickerIndex(i);
  }, []);

  return (
    <View style={s.card}>
      <Text style={s.title}>Add Device Photos (Optional)</Text>

      <View style={s.grid}>
        {PHOTO_LABELS.map((label, i) => (
          <PhotoSlot
            key={label}
            label={label}
            uri={photos[i]}
            index={i}
            onPick={handlePick}
            onRemove={onRemove}
          />
        ))}
      </View>

      <Text style={s.hint}>Tap an empty slot to take or choose a photo</Text>

      <Modal
        visible={pickerIndex != null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerIndex(null)}
      >
        <Pressable
          style={s.modalOverlay}
          onPress={() => setPickerIndex(null)}
        >
          <Pressable style={s.actionSheet} onPress={() => {}}>
            <View style={s.actionHandle} />
            <Pressable style={s.actionBtn} onPress={handleCamera}>
              <Text style={s.actionBtnText}>Take Photo</Text>
            </Pressable>
            <View style={s.actionDivider} />
            <Pressable style={s.actionBtn} onPress={handleGallery}>
              <Text style={s.actionBtnText}>Choose from Gallery</Text>
            </Pressable>
            <View style={s.actionDivider} />
            <Pressable
              style={s.actionBtn}
              onPress={() => setPickerIndex(null)}
            >
              <Text style={[s.actionBtnText, { color: "#DC2626" }]}>
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    justifyContent: "center",
  },
  slotCol: {
    alignItems: "center",
    gap: 4,
    width: "30%",
  },
  slot: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  slotFilled: {
    borderStyle: "solid",
    borderColor: "#1A56FF",
    backgroundColor: "#EEF3FF",
  },
  slotImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  checkBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  slotIconLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 4,
  },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  slotLabel: {
    fontSize: 9,
    fontWeight: "500",
    color: "#CBD5E1",
  },
  hint: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 11,
    color: "#CBD5E1",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  actionHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  actionBtn: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
  actionDivider: {
    width: "80%",
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
});

export default memo(PhotoUploadCard);
