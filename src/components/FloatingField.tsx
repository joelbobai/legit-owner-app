import React, { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

export type FloatingFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
  renderIcon: (isFocused: boolean) => React.ReactNode;
  right?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  style?: ViewStyle;
  // When false, TextInput is non-editable (no keyboard). Use together with
  // onPress to build "tap to open picker" fields.
  editable?: boolean;
  // When provided, an absoluteFill Pressable overlay is rendered inside
  // fieldInner so the entire field acts as a button (e.g. date/state pickers).
  // Only pass this when editable={false} — otherwise the overlay would block
  // the TextInput from receiving focus.
  onPress?: () => void;
};

export const FloatingField = memo(function FloatingField({
  label,
  value,
  placeholder,
  onChangeText,
  renderIcon,
  right,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  style,
  editable = true,
  onPress,
}: FloatingFieldProps) {
  // 'use no memo' — opts this component OUT of the React Compiler
  // (experiments.reactCompiler:true in app.json). Without this directive, the
  // compiler generates a shared per-module cache array whose slots can alias
  // across multiple FloatingField instances, making all fields reflect the same
  // isFocused value when any one changes.
  // memo() on the outer wrapper is manual and safe — the compiler is not
  // generating its own memoization for this function, so there is no conflict.
  "use no memo";

  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value.length > 0;

  // Stable references — prevents Fabric from re-registering native listeners
  // on every render, which can trigger the responder-probe cycle that causes
  // sibling TextInputs to receive spurious onFocus events.
  const handleFocus = useCallback(() => {
    // DEBUG (uncomment to verify only one field fires per tap):
    // console.log(`[FOCUS → "${label}"]`, Date.now());
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // console.log(`[BLUR → "${label}"]`, Date.now());
    setIsFocused(false);
  }, []);

  return (
    // collapsable={false} — Fabric collapses "passthrough" Views, destroying
    // their stable native ID. Loss of ID during a layout pass (e.g. keyboard
    // appearing) causes Android to re-evaluate all responders in the viewport
    // and can dispatch focus probes to every sibling TextInput.
    <View style={[s.fieldOuter, style]} collapsable={false}>
      <View
        style={[s.fieldInner, isFocused && s.fieldFocused]}
        collapsable={false}
      >
        {/*
         * WHY THE LABEL IS INSIDE fieldInner (not a sibling):
         *
         * s.fieldFocused applies elevation:3 to fieldInner on Android.
         * Android elevation creates a hardware-composited layer; that layer
         * is painted ABOVE all lower-elevation content in the same parent,
         * regardless of zIndex. The floating label (no elevation) is in the
         * base layer — fieldInner's border paints over it.
         *
         * By making the label a child of fieldInner, it is part of the same
         * composited layer. React Native paints children AFTER the parent's
         * own background + border, so the label's white background correctly
         * "breaks" the top border line wherever it sits.
         *
         * fieldInner needs overflow:"visible" so the label (top:-9) can
         * extend above the 56px container without being clipped.
         *
         * The label is always rendered (never conditionally mounted) to avoid
         * changing fieldInner's child count, which triggers a Fabric view-
         * hierarchy reconciliation that can briefly reset adjacent input focus.
         * Opacity controls visibility at zero layout cost.
         */}
        <Text
          style={[
            s.floatingLabel,
            {
              color: isFocused ? "#1A56FF" : "#94A3B8",
              opacity: showLabel ? 1 : 0,
            },
          ]}
          importantForAccessibility="no"
          accessible={false}
        >
          {label}
        </Text>

        <View style={s.fieldIconWrap}>{renderIcon(isFocused)}</View>

        <TextInput
          style={s.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          editable={editable}
          // nativeID gives Fabric a stable string identity for this input so
          // it is never confused with a sibling during layout reconciliation.
          nativeID={`floating-field-${label}`}
        />

        {right !== undefined && <View style={s.fieldRightWrap}>{right}</View>}

        {/*
         * Tap-to-open overlay — only rendered when onPress is provided.
         *
         * An absoluteFill Pressable inside fieldInner captures every touch on
         * the field and fires onPress (e.g. to open a date or state picker).
         * It must be the LAST child of fieldInner so it sits on top of the
         * TextInput and the right-slot View in the stacking order, ensuring
         * no touch leaks through to the non-editable TextInput.
         *
         * android_ripple={null} suppresses the default ink-ripple so the
         * field's existing border/background treatment is not obscured.
         */}
        {onPress !== undefined && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onPress}
            android_ripple={null}
            accessible={false}
          />
        )}
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  fieldOuter: {
    // overflow:visible propagates to fieldInner's shadow so it isn't clipped.
    overflow: "visible",
  },
  fieldInner: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    // overflow:visible is required for the absolutely-positioned floating label
    // (top:-9) to extend above the top of this 56px container. Without it,
    // anything above y=0 of fieldInner is clipped and invisible.
    overflow: "visible",
  },
  fieldFocused: {
    borderColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  // The floating label sits at top:-9 relative to fieldInner, which places it
  // centred on the top border line (border is 1.5px; label centre ≈ -9+7 = -2px
  // from fieldInner top edge). Its white backgroundColor "erases" the border
  // underneath, producing the classic material floating-label cut-through.
  floatingLabel: {
    position: "absolute",
    top: -9,
    left: 14,
    backgroundColor: "white",
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: 4,
    // zIndex within fieldInner's own stacking context — ensures the label
    // renders above any other absolutely-positioned children inside fieldInner.
    zIndex: 1,
  },
  fieldIconWrap: { paddingLeft: 14, paddingRight: 10 },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#0D0D0D",
    height: 56,
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  fieldRightWrap: { paddingRight: 14 },
});
