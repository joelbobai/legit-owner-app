import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BellIcon, SearchIcon } from '@/components/Icon';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "☀️" };
  if (h < 17) return { text: "Good afternoon", emoji: "🌤️" };
  return { text: "Good evening", emoji: "🌙" };
}

export function HomeHeader({ name }: { name?: string }) {
  const greeting = useMemo(getGreeting, []);

  return (
    <View style={s.header}>
      <View>
        <Text style={s.greetingSub}>{greeting.text} {greeting.emoji}</Text>
        <Text style={s.greetingName}>{name ?? 'User'} 👋</Text>
      </View>
      <View style={s.icons}>
        <Pressable style={s.iconBtn}>
          <SearchIcon size={22} color="#0D0D0D" />
        </Pressable>
        <Pressable style={s.iconBtn}>
          <BellIcon size={22} color="#0D0D0D" />
          <View style={s.badge}>
            <Text style={s.badgeText}>3</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    height: 72,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  greetingSub: { fontSize: 13, color: '#94A3B8' },
  greetingName: { fontSize: 20, fontWeight: '700', color: '#0D0D0D', marginTop: 2 },
  icons: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 8, fontWeight: '700', color: 'white' },
});
