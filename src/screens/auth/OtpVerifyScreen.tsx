import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { ClockIcon, ShieldCheckOutlineIcon } from '@/components/Icon';

import { AppBar, HelpButton } from '@/components/AppBar';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { BottomActionBar } from '@/components/BottomActionBar';
import { DotGrid } from '@/components/DotGrid';
import { FormCard } from '@/components/FormCard';
import { PrimaryButton } from '@/components/PrimaryButton';

// ─── Illustration ─────────────────────────────────────────────────────────────

function PhoneIllustration() {
  return (
    <View style={s.illustWrap}>
      <View style={s.illustRing} />
      <Svg width={72} height={120} viewBox="0 0 72 120" fill="none">
        <Defs>
          <LinearGradient id="phoneG" x1="2" y1="2" x2="70" y2="118" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3B74FF" />
            <Stop offset="100%" stopColor="#0A2ECC" />
          </LinearGradient>
        </Defs>
        <Rect x="2" y="2" width="68" height="116" rx="12" fill="url(#phoneG)" />
        <Rect x="8" y="12" width="56" height="88" rx="6" fill="rgba(255,255,255,0.15)" />
        <Rect x="26" y="6" width="20" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
        <Rect x="26" y="108" width="20" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
      </Svg>
      <View style={s.codeBadge}>
        <Text style={s.codeBadgeLabel}>Your code</Text>
        <Text style={s.codeBadgeDots}>••••••</Text>
      </View>
    </View>
  );
}

// ─── Single OTP digit cell ────────────────────────────────────────────────────

function OtpDigitInput({
  index,
  value,
  isFocused,
  onFocus,
  onBlur,
  onChange,
  onKeyPress,
  inputRef,
}: {
  index: number;
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (text: string) => void;
  onKeyPress: (key: string) => void;
  inputRef: (r: TextInput | null) => void;
}) {
  // 'use no memo' — prevents the React Compiler (experiments.reactCompiler:true
  // in app.json) from sharing its per-module memoization cache across the 6
  // OtpDigitInput instances rendered by the parent's map. Without this, the
  // compiler can assign the same isFocused/value cache slot to multiple
  // instances, making every digit box show the focused style when any one is
  // tapped.
  "use no memo";

  const isFilled = !!value && !isFocused;

  // Stable wrapper — onKeyPress prop is already stable (created by parent's
  // useMemo), but wrapping it here gives Fabric a constant native callback
  // reference, preventing listener de-registration on every render.
  const handleKeyPress = useCallback(
    ({ nativeEvent }: { nativeEvent: { key: string } }) =>
      onKeyPress(nativeEvent.key),
    [onKeyPress],
  );

  return (
    // collapsable={false} — Fabric "collapses" passthrough Views by merging
    // them into their parent, destroying their stable native ID. Loss of ID
    // during a layout pass (keyboard appearing) causes Android to re-evaluate
    // all responders in the viewport and can send focus probes to every
    // visible TextInput simultaneously. A stable native ID prevents this.
    <View
      collapsable={false}
      style={[
        s.otpBox,
        isFilled ? s.otpFilled : isFocused ? s.otpActive : s.otpEmpty,
      ]}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        onKeyPress={handleKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        keyboardType="numeric"
        maxLength={1}
        textAlign="center"
        caretHidden
        style={s.otpInput}
        // Unique stable string ID per digit position — Fabric uses nativeID
        // as the key to track each TextInput across layout reconciliations.
        // Without distinct IDs the 6 inputs are indistinguishable to Fabric
        // and can receive each other's focus events.
        nativeID={`otp-field-${index}`}
      />
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OtpVerifyScreen() {
  // 'use no memo' — same reasoning as OtpDigitInput: prevents the React
  // Compiler from sharing cache slots between this component and any other
  // component whose compiled memoization lands in the same module cache.
  "use no memo";

  const insets = useSafeAreaInsets();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [timer, setTimer] = useState(165);
  const refs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  // Keep a ref to the current otp array so the stable handler closures below
  // (created once via useMemo) always read the latest value without needing
  // to be recreated. This is the standard "stable callback over mutable state"
  // pattern — the handlers never re-create but always see current otp.
  const otpRef = useRef(otp);
  otpRef.current = otp;

  const expired = timer === 0;

  useEffect(() => {
    if (expired) return;
    const id = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [expired]);

  const mm = String(Math.floor(timer / 60)).padStart(2, '0');
  const ss = String(timer % 60).padStart(2, '0');

  // ── Stable per-index focus handlers ─────────────────────────────────────────
  // useMemo with [] deps — React guarantees that state dispatch functions
  // (setFocusedIdx, setOtp) never change identity, so these closures are safe
  // to create once at mount and reuse for the component's lifetime.
  //
  // WHY per-index arrays instead of inline lambdas in the map:
  //   Every time focusedIdx changes (i.e. on every tap), the screen re-renders.
  //   Inline lambdas  `() => setFocusedIdx(i)` would create 6 NEW function
  //   references each render. Fabric sees new onFocus/onBlur props for all 6
  //   TextInputs simultaneously and de-registers + re-registers their native
  //   listeners all at once. That listener churn triggers a responder-probe
  //   re-evaluation that can dispatch focus events to all 6 inputs at the same
  //   time — exactly the simultaneous-activation bug.
  const focusHandlers = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => () => {
        // DEBUG — uncomment to verify only ONE digit fires per tap:
        // console.log(`[FOCUS → OTP digit ${i}]`, Date.now());
        setFocusedIdx(i);
      }),
    [],
  );

  const blurHandler = useCallback(() => {
    // console.log('[BLUR → OTP]', Date.now());
    setFocusedIdx(-1);
  }, []);

  // Stable per-index digit-change handlers — read otpRef.current so they
  // always operate on the latest OTP array without being recreated.
  const digitHandlers = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => (text: string) => {
        const d = text.replace(/[^0-9]/g, '').slice(-1);
        const next = [...otpRef.current];
        next[i] = d;
        setOtp(next);
        if (d && i < 5) refs.current[i + 1]?.focus();
      }),
    [],
  );

  // Stable per-index backspace handlers.
  const keyHandlers = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => (key: string) => {
        if (key === 'Backspace' && !otpRef.current[i] && i > 0) {
          const next = [...otpRef.current];
          next[i - 1] = '';
          setOtp(next);
          refs.current[i - 1]?.focus();
        }
      }),
    [],
  );

  // Stable ref-setter callbacks — Fabric can lose a TextInput ref if the
  // setter callback changes identity during a layout reconciliation, so we
  // pre-create one stable setter per index.
  const refSetters = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => (r: TextInput | null) => {
        refs.current[i] = r;
      }),
    [],
  );

  const handleResend = useCallback(() => {
    if (!expired) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(165);
    refs.current[0]?.focus();
  }, [expired]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.screen}>
        <DotGrid id="dotsFP2" />
        <BackgroundBlobs />

        <View style={{ height: insets.top }} />
        <AppBar
          title="Verify Code"
          onBack={() => router.back()}
          right={<HelpButton />}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PhoneIllustration />
          <Text style={s.title}>Check your messages</Text>
          <Text style={s.sub}>
            We sent a 6-digit code to{' '}
            <Text style={s.subBold}>+234 801 234 5678</Text>
          </Text>

          <FormCard style={s.card}>
            <Text style={s.otpLabel}>Enter 6-digit code</Text>
            <View style={s.otpRow}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                // key={i} is stable — digit positions never reorder.
                <OtpDigitInput
                  key={i}
                  index={i}
                  value={otp[i]}
                  isFocused={focusedIdx === i}
                  onFocus={focusHandlers[i]}
                  onBlur={blurHandler}
                  onChange={digitHandlers[i]}
                  onKeyPress={keyHandlers[i]}
                  inputRef={refSetters[i]}
                />
              ))}
            </View>

            <View style={s.timerRow}>
              <View style={s.timerLeft}>
                <ClockIcon size={16} color="#94A3B8" />
                {expired ? (
                  <Text style={s.timerText}>Code expired</Text>
                ) : (
                  <Text style={s.timerText}>
                    Code expires in <Text style={s.timerBlue}>{mm}:{ss}</Text>
                  </Text>
                )}
              </View>
              <Pressable onPress={handleResend}>
                <Text style={[s.resendText, { color: expired ? '#1A56FF' : '#CBD5E1' }]}>
                  Resend Code
                </Text>
              </Pressable>
            </View>
          </FormCard>
        </ScrollView>

        <BottomActionBar paddingBottom={insets.bottom + 16}>
          <PrimaryButton
            label="Verify Code"
            onPress={() => router.push('/(auth)/new-password' as any)}
            icon={<ShieldCheckOutlineIcon size={20} color="white" />}
          />
        </BottomActionBar>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  codeBadge: {
    position: 'absolute', top: 14, right: 0,
    backgroundColor: 'white', borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 6,
    gap: 4,
  },
  codeBadgeLabel: { fontSize: 9, fontWeight: '600', color: '#1A56FF' },
  codeBadgeDots: { fontSize: 16, fontWeight: '900', color: '#0D0D0D', letterSpacing: 3 },

  title: {
    fontSize: 26, fontWeight: '700', color: '#0D0D0D',
    textAlign: 'center', marginTop: 16, marginBottom: 10,
  },
  sub: { fontSize: 14, color: '#4A4A4A', textAlign: 'center', lineHeight: 22 },
  subBold: { fontWeight: '700', color: '#0D0D0D' },

  card: { marginTop: 24, width: '100%' },
  otpLabel: { fontSize: 14, fontWeight: '600', color: '#0D0D0D', marginBottom: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },

  // otpBox has no overflow set — the digit input fills the box exactly,
  // so no clipping is needed and no label needs to extend outside.
  otpBox: {
    width: 48, height: 56, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  otpFilled: { backgroundColor: '#EEF3FF', borderWidth: 1.5, borderColor: '#1A56FF' },
  otpActive: {
    backgroundColor: 'white', borderWidth: 2, borderColor: '#1A56FF',
    shadowColor: '#1A56FF', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  otpEmpty: { backgroundColor: '#F5F7FA', borderWidth: 1.5, borderColor: '#E2E8F0' },
  otpInput: {
    width: 48, height: 56, fontSize: 22, fontWeight: '700',
    color: '#0D0D0D', textAlign: 'center',
    paddingVertical: 0, includeFontPadding: false,
  },

  timerRow: {
    marginTop: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  timerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerText: { fontSize: 13, color: '#94A3B8' },
  timerBlue: { color: '#1A56FF', fontWeight: '600' },
  resendText: { fontSize: 13, fontWeight: '600' },
});
