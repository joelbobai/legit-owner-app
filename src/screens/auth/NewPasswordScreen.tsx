import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { CheckCircleIcon, CheckmarkIcon, LockIcon, EyeIcon, EyeSlashIcon, RefreshCircleIcon } from '@/components/Icon';
import { AppBar, HelpButton } from '@/components/AppBar';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { BottomActionBar } from '@/components/BottomActionBar';
import { DotGrid } from '@/components/DotGrid';
import { FormCard } from '@/components/FormCard';
import { PrimaryButton } from '@/components/PrimaryButton';

// ─── Lock illustration ────────────────────────────────────────────────────────

function LockIllustration() {
  return (
    <View style={s.illustWrap}>
      <View style={s.illustRing} />
      <Svg width={80} height={96} viewBox="0 0 80 96" fill="none">
        <Defs>
          <LinearGradient id="lockG" x1="4" y1="40" x2="76" y2="92" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3B74FF" />
            <Stop offset="100%" stopColor="#0A2ECC" />
          </LinearGradient>
        </Defs>
        <Rect x="4" y="40" width="72" height="52" rx="10" fill="url(#lockG)" />
        <Path d="M22 40V24C22 13.5 58 13.5 58 24" stroke="#1A56FF" strokeWidth="7" strokeLinecap="round" opacity={0.5} />
        <Circle cx="40" cy="66" r="8" fill="rgba(255,255,255,0.3)" />
        <Rect x="37" y="66" width="6" height="10" rx="3" fill="rgba(255,255,255,0.5)" />
      </Svg>
      <View style={[s.sparkle, { left: 18, top: 24, width: 8, height: 8, backgroundColor: '#1A56FF' }]} />
      <View style={[s.sparkle, { right: 10, top: 30, width: 6, height: 6, backgroundColor: '#F59E0B' }]} />
      <View style={[s.sparkle, { right: 0, bottom: 20, width: 5, height: 5, backgroundColor: '#1A56FF' }]} />
      <View style={[s.sparkle, { left: 16, bottom: 10, width: 7, height: 7, backgroundColor: '#F59E0B' }]} />
    </View>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────

function PasswordField({
  value,
  onChangeText,
  placeholder,
  fieldId,
  isConfirm,
  matched,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  // fieldId is passed by the parent to give each TextInput a unique nativeID.
  // Without it, Fabric cannot distinguish the two PasswordField TextInputs and
  // may emit focus probes to both when one is tapped.
  fieldId: string;
  isConfirm?: boolean;
  matched?: boolean;
}) {
  // 'use no memo' — same reasoning as FloatingField: the React Compiler
  // (experiments.reactCompiler:true) can share per-module cache slots across
  // multiple instances of the same component. Two PasswordField instances in
  // the same FormCard would then share isFocused state, making both fields
  // appear focused when either one is tapped.
  "use no memo";

  const [isFocused, setIsFocused] = useState(false);
  const [show, setShow] = useState(false);

  const showLabel = isFocused || value.length > 0;

  const handleFocus = useCallback(() => {
    // DEBUG — uncomment to verify only this field fires when tapped:
    // console.log(`[FOCUS → PasswordField "${fieldId}"]`, Date.now());
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    // console.log(`[BLUR → PasswordField "${fieldId}"]`, Date.now());
    setIsFocused(false);
  }, []);

  const toggleShow = useCallback(() => setShow(v => !v), []);

  const borderColor =
    isConfirm && value.length > 0
      ? matched ? '#16A34A' : '#E2E8F0'
      : isFocused ? '#1A56FF' : '#E2E8F0';

  const shadowColor = isConfirm && matched ? '#16A34A' : '#1A56FF';
  const showFocusRing = isFocused || (isConfirm && value.length > 0 && matched);
  const labelColor = isConfirm && matched ? '#16A34A' : isFocused ? '#1A56FF' : '#94A3B8';
  const iconColor = isFocused ? '#1A56FF' : '#94A3B8';

  return (
    // collapsable={false} — Fabric can collapse passthrough Views, causing them
    // to lose their stable native ID. During the next layout pass (keyboard
    // show/hide), Android re-evaluates all responders in the viewport and can
    // send focus probes to every visible TextInput. Stable IDs prevent this.
    <View style={s.fieldOuter} collapsable={false}>
      <View
        style={[
          s.fieldInner,
          { borderColor },
          showFocusRing && {
            shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 3,
          },
        ]}
        collapsable={false}
      >
        {/*
         * Floating label INSIDE the border View — same fix as FloatingField.
         *
         * When showFocusRing is true, elevation:3 is applied to fieldInner.
         * On Android, elevation creates a composited layer that renders above
         * all lower-elevation siblings regardless of zIndex. The label (no
         * elevation) would be behind the border if placed outside fieldInner.
         *
         * Inside fieldInner, the label is part of the same composited layer.
         * React Native paints children AFTER the parent's border, so the
         * label's white background correctly cuts through the border line.
         *
         * Always rendered (opacity toggles instead of conditional mount) to
         * keep fieldInner's child count stable. A child-count change triggers
         * a Fabric view-hierarchy reconciliation that can briefly reset focus
         * on the other PasswordField in the same FormCard.
         */}
        <Text
          style={[s.floatingLabel, { color: labelColor, opacity: showLabel ? 1 : 0 }]}
          importantForAccessibility="no"
          accessible={false}
        >
          {placeholder}
        </Text>

        <View style={s.fieldIconWrap}>
          <LockIcon size={20} color={iconColor} />
        </View>

        <TextInput
          style={s.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${placeholder.toLowerCase()}`}
          placeholderTextColor="#CBD5E1"
          secureTextEntry={!show}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          // Unique nativeID per instance — Fabric uses this as the stable key
          // to identify this TextInput during layout reconciliation. Without
          // distinct IDs, the two PasswordField TextInputs look identical to
          // Fabric and can receive each other's focus events.
          nativeID={`password-field-${fieldId}`}
        />

        <Pressable onPress={toggleShow} style={s.fieldRightWrap} hitSlop={8}>
          {isConfirm && value.length > 0 && matched ? (
            <CheckCircleIcon size={20} color="#16A34A" />
          ) : show ? (
            <EyeSlashIcon size={20} color="#94A3B8" />
          ) : (
            <EyeIcon size={20} color="#94A3B8" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ─── Strength config ──────────────────────────────────────────────────────────

const STRENGTH_COLORS: Record<number, string> = {
  0: '#E2E8F0', 1: '#EF4444', 2: '#F59E0B', 3: '#3B82F6', 4: '#16A34A',
};
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong 💪'];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewPasswordScreen() {
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const reqs = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = reqs.filter(r => r.met).length;
  const matched = confirm.length > 0 && confirm === password;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.screen}>
        <DotGrid id="dotsFP3" />
        <BackgroundBlobs />

        <View style={{ height: insets.top }} />
        <AppBar
          title="New Password"
          onBack={() => router.back()}
          right={<HelpButton />}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LockIllustration />
          <Text style={s.title}>Create new password</Text>
          <Text style={s.sub}>
            Your new password must be different from your previous password
          </Text>

          <FormCard style={s.card}>
            <PasswordField
              value={password}
              onChangeText={setPassword}
              placeholder="New Password"
              fieldId="new"
            />

            {password.length > 0 && (
              <>
                <View style={s.strengthRow}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[
                        s.strengthBar,
                        { backgroundColor: i < strength ? STRENGTH_COLORS[strength] : '#E2E8F0' },
                      ]}
                    />
                  ))}
                  <Text style={[s.strengthLabel, { color: STRENGTH_COLORS[strength] }]}>
                    {STRENGTH_LABELS[strength]}
                  </Text>
                </View>

                <View style={s.reqList}>
                  {reqs.map((r, i) => (
                    <View key={i} style={s.reqRow}>
                      <View
                        style={[
                          s.reqCheck,
                          {
                            backgroundColor: r.met ? '#16A34A' : 'transparent',
                            borderWidth: r.met ? 0 : 1.5,
                            borderColor: '#CBD5E1',
                          },
                        ]}
                      >
                        {r.met && <CheckmarkIcon size={10} color="white" />}
                      </View>
                      <Text style={[s.reqText, { color: r.met ? '#0D0D0D' : '#94A3B8' }]}>
                        {r.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <PasswordField
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm New Password"
              fieldId="confirm"
              isConfirm
              matched={matched}
            />
          </FormCard>
        </ScrollView>

        <BottomActionBar paddingBottom={insets.bottom + 16}>
          <PrimaryButton
            label="Reset Password"
            onPress={() => router.push('/(auth)/reset-success' as any)}
            icon={<RefreshCircleIcon size={20} color="white" />}
          />
        </BottomActionBar>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20, paddingBottom: 24, alignItems: 'center' },

  illustWrap: {
    width: 160, height: 160,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 24, position: 'relative',
  },
  illustRing: {
    position: 'absolute', width: 180, height: 180,
    borderRadius: 90, backgroundColor: '#EEF3FF',
  },
  sparkle: { position: 'absolute', borderRadius: 100, opacity: 0.7 },

  title: {
    fontSize: 26, fontWeight: '700', color: '#0D0D0D',
    textAlign: 'center', marginTop: 16, marginBottom: 10,
  },
  sub: {
    fontSize: 14, color: '#4A4A4A', textAlign: 'center',
    lineHeight: 22, maxWidth: 320,
  },

  card: { marginTop: 24, width: '100%', gap: 16 },

  // ─── Password field (local to this screen) ──────────────────────────────────
  fieldOuter: {
    overflow: 'visible',
  },
  fieldInner: {
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    // overflow:visible lets the floating label (top:-9) extend above the top
    // of this container without being clipped.
    overflow: 'visible',
  },
  // Label is inside fieldInner so it shares the same composited layer as the
  // border. It therefore always renders on top of the border line, regardless
  // of whether elevation is applied to fieldInner.
  floatingLabel: {
    position: 'absolute',
    top: -9,
    left: 14,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: '600',
    borderRadius: 4,
    zIndex: 1,
  },
  fieldIconWrap: { paddingLeft: 14, paddingRight: 10 },
  fieldInput: {
    flex: 1, fontSize: 15, color: '#0D0D0D',
    height: 56, paddingVertical: 0,
    textAlignVertical: 'center', includeFontPadding: false,
  },
  fieldRightWrap: { paddingRight: 14 },

  // ─── Strength meter ─────────────────────────────────────────────────────────
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strengthBar: { flex: 1, height: 4, borderRadius: 100 },
  strengthLabel: { fontSize: 12, fontWeight: '600', marginLeft: 4 },

  reqList: { gap: 6 },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqCheck: {
    width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  reqText: { fontSize: 12 },
});
