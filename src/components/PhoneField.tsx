import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChevronDownIcon } from '@/components/Icon';

export function PhoneField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  "use no memo";

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    // DEBUG: console.log('[FOCUS → PhoneField]', Date.now());
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // DEBUG: console.log('[BLUR → PhoneField]', Date.now());
    setIsFocused(false);
  }, []);

  return (
    <View style={s.fieldOuter} collapsable={false}>
      <View style={[s.fieldInner, isFocused && s.fieldFocused]} collapsable={false}>
        {/* A Pressable with no onPress is a half-registered responder on Fabric/
            Android. It claims ownership of a touch gesture but cannot complete it,
            so Fabric falls back to re-evaluating the entire responder tree — which
            can send spurious focus probes to every sibling TextInput in the same
            ScrollView. Adding an empty onPress makes it a complete responder that
            cleanly handles and terminates the gesture. */}
        <Pressable style={s.prefix} onPress={() => { /* TODO: open country picker */ }}>
          <Text style={s.flag}>🇳🇬</Text>
          <Text style={s.code}>+234</Text>
          <ChevronDownIcon size={16} color="#94A3B8" />
        </Pressable>
        <View style={s.divider} />
        <TextInput
          style={[s.fieldInput, { paddingLeft: 12 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder="08012345678"
          placeholderTextColor="#CBD5E1"
          keyboardType="phone-pad"
          onFocus={handleFocus}
          onBlur={handleBlur}
          nativeID="phone-field-input"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fieldOuter: { position: 'relative', overflow: 'visible' },
  fieldInner: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  fieldFocused: {
    borderColor: '#1A56FF',
    shadowColor: '#1A56FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 14,
    paddingRight: 12,
  },
  flag: { fontSize: 18, lineHeight: 22 },
  code: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  divider: { width: 1, height: 28, backgroundColor: '#E2E8F0' },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: '#0D0D0D',
    height: 56,
    paddingVertical: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
