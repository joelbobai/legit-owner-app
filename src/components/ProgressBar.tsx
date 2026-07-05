import { DimensionValue, StyleSheet, Text, View } from 'react-native';

export function ProgressBar({
  progress,
  label,
  dark = false,
}: {
  progress: DimensionValue;
  label: string;
  dark?: boolean;
}) {
  return (
    <>
      <View
        style={[
          s.track,
          { backgroundColor: dark ? '#2A2A2A' : '#E2E8F0' },
        ]}
      >
        <View style={[s.fill, { width: progress }]} />
      </View>
      <Text style={[s.label, dark && { color: '#94A3B8' }]}>{label}</Text>
    </>
  );
}

const s = StyleSheet.create({
  track: { height: 6 },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1A56FF',
  },
  label: {
    textAlign: 'right',
    paddingHorizontal: 20,
    paddingTop: 6,
    fontSize: 12,
    color: '#94A3B8',
  },
});
