import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export function BottomActionBar({
  children,
  paddingBottom = 16,
  backgroundColor = 'white',
  style,
}: {
  children: React.ReactNode;
  paddingBottom?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        s.bar,
        { paddingBottom, backgroundColor },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
