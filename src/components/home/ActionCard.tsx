import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const CARD_W = (Dimensions.get('window').width - 40 - 12) / 2;

export function ActionCard({
  iconBg,
  icon,
  label,
  caption,
  onPress,
}: {
  iconBg: string;
  icon: React.ReactNode;
  label: string;
  caption: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={[s.card, { width: CARD_W }]} onPress={onPress}>
      <View style={[s.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <View>
        <Text style={s.label}>{label}</Text>
        <Text style={s.caption}>{caption}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    height: 115,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 6,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#0D0D0D' },
  caption: { fontSize: 11, color: '#94A3B8' },
});
