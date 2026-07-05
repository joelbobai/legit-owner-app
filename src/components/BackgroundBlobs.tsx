import { StyleSheet, View } from 'react-native';

export function BackgroundBlobs() {
  return (
    <>
      <View style={s.blobTR} pointerEvents="none" />
      <View style={s.blobBL} pointerEvents="none" />
    </>
  );
}

const s = StyleSheet.create({
  blobTR: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EEF3FF',
    opacity: 0.5,
  },
  blobBL: {
    position: 'absolute',
    bottom: 60,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF3FF',
    opacity: 0.3,
  },
});
