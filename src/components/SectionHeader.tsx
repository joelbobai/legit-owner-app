import { StyleSheet, Text, View } from 'react-native';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <View>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text style={[s.title, dark && { color: 'white' }]}>{title}</Text>
      <Text style={[s.subtitle, dark && { color: '#94A3B8' }]}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A56FF',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0D0D0D',
    lineHeight: 32,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 21,
  },
});
