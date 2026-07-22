import { memo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { FontFamily } from "@/constants/typography";
import { DevicePhoto } from "@/types/device";

const { width: SW } = Dimensions.get("window");
const PAD = 20;
const COLS = 4;
const SPACING = 4;

type Props = {
  photos: DevicePhoto[];
};

const TYPE_LABELS: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
  receipt: "Receipt",
  box: "Box",
  OCR: "IMEI Proof",
};

function DevicePhotoGallery({ photos }: Props) {
  const [selected, setSelected] = useState<DevicePhoto | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <View style={s.card}>
        <Text style={s.title}>Device Photos</Text>
        <View style={s.grid}>
          {photos.map((photo, i) => (
            <View key={i} style={s.cell}>
              <Pressable
                style={s.imageWrap}
                onPress={() => setSelected(photo)}
              >
                <Image source={{ uri: photo.url }} style={s.image} />
                {photo.type ? (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>
                      {TYPE_LABELS[photo.type] || photo.type}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={s.modalOverlay}>
          <Pressable style={s.modalClose} onPress={() => setSelected(null)}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 6L18 18M18 6L6 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
          {selected && (
            <Image
              source={{ uri: selected.url }}
              style={s.modalImage}
              resizeMode="contain"
            />
          )}
          {selected?.type ? (
            <View style={s.modalBadge}>
              <Text style={s.modalBadgeText}>
                {TYPE_LABELS[selected.type] || selected.type}
              </Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: PAD,
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
    fontFamily: FontFamily.semibold,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: -SPACING,
    marginRight: -SPACING,
  },
  cell: {
    width: `${100 / COLS}%`,
    aspectRatio: 1,
    padding: SPACING,
  },
  imageWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: SW,
    height: "80%",
  },
  modalBadge: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(DevicePhotoGallery);
