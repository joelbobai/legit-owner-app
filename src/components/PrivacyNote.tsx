import { StyleSheet, Text, TextStyle, View } from 'react-native';

import { ShieldCheckIcon } from '@/components/Icon';

export function PrivacyNote({
  text,
  textStyle,
}: {
  text: string;
  textStyle?: TextStyle;
}) {
  return (
    <View style={s.row}>
      <ShieldCheckIcon size={16} color="#16A34A" />
      <Text style={[s.text, textStyle]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 13,
    color: '#4A4A4A',
    flex: 1,
  },
});
