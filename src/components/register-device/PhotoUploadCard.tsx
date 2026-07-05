import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

type PhotoSlotProps = {
  label: string;
  index: number;
  photos: (string | null)[];
  onAdd: (i: number) => void;
  onRemove: (i: number) => void;
};

function CameraIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

function PhotoPreview() {
  return (
    <View style={s.preview}>
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke="#1A56FF" strokeWidth="1.5" fill="none" />
      <Circle cx="9" cy="11" r="2" stroke="#1A56FF" strokeWidth="1.3" fill="none" />
      <Path
        d="M15.5 9.5L20 14V16C20 17.1 19.1 18 18 18H6C4.9 18 4 17.1 4 16V8C4 6.9 4.9 6 6 6H12"
        stroke="#1A56FF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </View>
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

function PhotoSlot({ label, index, photos, onAdd, onRemove }: PhotoSlotProps) {
  const hasPhoto = photos[index] != null;

  return (
    <View style={s.slotCol}>
      <Pressable
        style={[s.slot, hasPhoto && s.slotFilled]}
        onPress={() => !hasPhoto && onAdd(index)}
      >
        {hasPhoto ? (
          <>
            <PhotoPreview />
            <Text style={s.slotPhotoLabel}>Photo {index + 1}</Text>
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
            <Text style={s.slotIconLabel}>{label}</Text>
          </>
        )}
      </Pressable>
      <Text style={s.slotLabel}>{label}</Text>
    </View>
  );
}

type Props = {
  photos: (string | null)[];
  onAdd: (i: number) => void;
  onRemove: (i: number) => void;
};

function PhotoUploadCard({ photos, onAdd, onRemove }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.title}>
        Add Device Photos (Optional — up to 3)
      </Text>

      <View style={s.row}>
        <PhotoSlot
          label="Front"
          index={0}
          photos={photos}
          onAdd={onAdd}
          onRemove={onRemove}
        />
        <PhotoSlot
          label="Back"
          index={1}
          photos={photos}
          onAdd={onAdd}
          onRemove={onRemove}
        />
        <PhotoSlot
          label="Side/Angle"
          index={2}
          photos={photos}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </View>

      <Text style={s.hint}>Tap to upload or take photo</Text>
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
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    justifyContent: "center",
  },
  slotCol: {
    alignItems: "center",
    gap: 6,
  },
  slot: {
    width: 100,
    height: 100,
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
  preview: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  slotPhotoLabel: {
    position: "absolute",
    bottom: 8,
    fontSize: 10,
    fontWeight: "600",
    color: "#1A56FF",
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
});

export default memo(PhotoUploadCard);
