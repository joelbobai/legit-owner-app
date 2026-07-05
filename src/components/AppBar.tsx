import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowLeftIcon, HelpIcon } from '@/components/Icon';

export function HelpButton({ dark = false }: { dark?: boolean }) {
  return (
    <View style={[s.helpBtn, dark && { backgroundColor: '#1A2340' }]}>
      <HelpIcon size={16} color="#1A56FF" />
    </View>
  );
}

export function StepBadge({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <View style={[s.stepBadge, dark && { backgroundColor: '#1A2340' }]}>
      <Text style={s.stepBadgeText}>{label}</Text>
    </View>
  );
}

export function AppBar({
  title,
  onBack,
  right,
  dark = false,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <View
      style={[
        s.bar,
        dark && { backgroundColor: '#0D0D0D', borderBottomColor: '#1A1A1A' },
      ]}
    >
      <Pressable style={s.backBtn} onPress={onBack} hitSlop={8}>
        <ArrowLeftIcon size={24} color={dark ? 'white' : '#0D0D0D'} />
      </Pressable>
      <Text style={[s.title, dark && { color: 'white' }]}>{title}</Text>
      <View style={s.rightSlot}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    height: 56,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0D0D',
  },
  rightSlot: { marginLeft: 'auto' },
  helpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    backgroundColor: '#EEF3FF',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  stepBadgeText: { fontSize: 13, fontWeight: '600', color: '#1A56FF' },
});
