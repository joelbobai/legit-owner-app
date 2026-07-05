import { Pressable, StyleSheet, Text, View } from 'react-native';

export function SectionRowHeader({
  title,
  linkText,
  onPress,
}: {
  title: string;
  linkText?: string;
  onPress?: () => void;
}) {
  return (
    <View style={s.row}>
      <Text style={s.title}>{title}</Text>
      {linkText && (
        <Pressable onPress={onPress}>
          <Text style={s.link}>{linkText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#0D0D0D' },
  link: { fontSize: 14, fontWeight: '600', color: '#1A56FF' },
});
