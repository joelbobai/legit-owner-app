import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'outline';

export function PrimaryButton({
  label,
  onPress,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        isOutline ? s.btnOutline : s.btnPrimary,
        disabled && s.btnDisabled,
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {iconPosition === 'left' && icon}
      <Text
        style={[
          s.label,
          isOutline ? s.labelOutline : s.labelPrimary,
          disabled && s.labelDisabled,
        ]}
      >
        {label}
      </Text>
      {iconPosition === 'right' && icon}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: '#1A56FF',
    shadowColor: '#1A56FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnOutline: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#1A56FF',
  },
  btnDisabled: {
    backgroundColor: '#1E1E2E',
    shadowOpacity: 0,
    elevation: 0,
  },
  label: { fontSize: 16, fontWeight: '600' },
  labelPrimary: { color: 'white' },
  labelOutline: { color: '#1A56FF' },
  labelDisabled: { color: '#4A4A5A' },
});
