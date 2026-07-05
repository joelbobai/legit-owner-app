import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

export type PillVariant = 'green' | 'gray' | 'yellow' | 'blue';

const PILL_STYLES: Record<PillVariant, { bg: string; text: string }> = {
  green:  { bg: '#DCFCE7', text: '#16A34A' },
  gray:   { bg: '#F1F5F9', text: '#64748B' },
  yellow: { bg: '#FEF9C3', text: '#CA8A04' },
  blue:   { bg: '#EEF3FF', text: '#1A56FF' },
};

export function ActivityCard({
  iconBg,
  icon,
  name,
  sub,
  time,
  pill,
  pillVariant,
}: {
  iconBg: string;
  icon: React.ReactNode;
  name: string;
  sub: string;
  time: string;
  pill: string;
  pillVariant: PillVariant;
}) {
  const ps = PILL_STYLES[pillVariant];
  return (
    <View style={s.card}>
      <View style={[s.iconWrap, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={s.name} numberOfLines={1}>{name}</Text>
        <Text style={s.sub}>{sub}</Text>
      </View>
      <View style={s.meta}>
        <Text style={s.time}>{time}</Text>
        <View style={[s.pill, { backgroundColor: ps.bg }]}>
          <Text style={[s.pillText, { color: ps.text }]}>{pill}</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 14, fontWeight: '600', color: '#0D0D0D' },
  sub: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  meta: { alignItems: 'flex-end', gap: 4 },
  time: { fontSize: 11, color: '#CBD5E1' },
  pill: { borderRadius: 100, paddingVertical: 2, paddingHorizontal: 8 },
  pillText: { fontSize: 10, fontWeight: '600' },
});
