import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckCircleIcon, EyeIcon } from '@/components/Icon';
import { AppBar, StepBadge } from '@/components/AppBar';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrivacyNote } from '@/components/PrivacyNote';
import { ProgressBar } from '@/components/ProgressBar';

const { width: SW } = Dimensions.get('window');
const VF = 280;

type VerifyState = 'scanning' | 'processing' | 'success';

export default function Step3FaceVerification() {
  const insets = useSafeAreaInsets();
  const [verifyState, setVerifyState] = useState<VerifyState>('scanning');

  // Auto-advance: scanning → processing → success
  useEffect(() => {
    if (verifyState === 'scanning') {
      const t = setTimeout(() => setVerifyState('processing'), 3000);
      return () => clearTimeout(t);
    }
    if (verifyState === 'processing') {
      const t = setTimeout(() => setVerifyState('success'), 2500);
      return () => clearTimeout(t);
    }
  }, [verifyState]);

  const isSuccess = verifyState === 'success';
  const accent = isSuccess ? '#16A34A' : '#1A56FF';

  // Ring pulse (scale)
  const ringScale = useSharedValue(1);
  useEffect(() => {
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    return () => cancelAnimation(ringScale);
  }, []);

  // Dashed oval rotation
  const ovalRot = useSharedValue(0);
  useEffect(() => {
    ovalRot.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1
    );
    return () => cancelAnimation(ovalRot);
  }, []);

  // Scan line sweep
  const scanY = useSharedValue(28);
  const scanOpacity = useSharedValue(1);
  useEffect(() => {
    if (verifyState === 'scanning') {
      scanOpacity.value = 1;
      scanY.value = withRepeat(
        withSequence(
          withTiming(246, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(28, { duration: 100 })
        ),
        -1
      );
    } else {
      scanOpacity.value = withTiming(0, { duration: 300 });
      cancelAnimation(scanY);
    }
    return () => cancelAnimation(scanY);
  }, [verifyState]);

  // Dot pulse (scanning pill)
  const dotOpacity = useSharedValue(1);
  const dotScale = useSharedValue(1);
  useEffect(() => {
    dotOpacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false
    );
    dotScale.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
      false
    );
    return () => {
      cancelAnimation(dotOpacity);
      cancelAnimation(dotScale);
    };
  }, []);

  // Spinner (processing pill)
  const spinAngle = useSharedValue(0);
  useEffect(() => {
    spinAngle.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1
    );
    return () => cancelAnimation(spinAngle);
  }, []);

  // Success overlay fade-in
  const successOpacity = useSharedValue(0);
  const successTransY = useSharedValue(10);
  useEffect(() => {
    if (verifyState === 'success') {
      successOpacity.value = withTiming(1, { duration: 400 });
      successTransY.value = withTiming(0, { duration: 400 });
    }
  }, [verifyState]);

  // Animated styles
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));
  const ovalStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ovalRot.value}deg` }],
  }));
  const scanLineStyle = useAnimatedStyle(() => ({
    top: scanY.value,
    opacity: scanOpacity.value,
  }));
  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: dotScale.value }],
  }));
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinAngle.value}deg` }],
  }));
  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ translateY: successTransY.value }],
  }));

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Background blobs */}
      <View style={s.blobTL} pointerEvents="none" />
      <View style={s.blobBR} pointerEvents="none" />
      <View style={[s.blobMid, { left: SW / 2 - 200 }]} pointerEvents="none" />

      <AppBar
        title="Face Verification"
        onBack={() => router.back()}
        right={<StepBadge label="3 of 3" dark />}
        dark
      />
      <ProgressBar progress="100%" label="Step 3 of 3 · Final Step" dark />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>BIOMETRIC CHECK</Text>
          <Text style={s.title}>Almost there!</Text>
          <Text style={s.subtitle}>
            Look directly at the camera and follow the on-screen guide
          </Text>
        </View>

        {/* ── Viewfinder ─────────────────────────────────────── */}
        <View style={s.vfWrap}>
          <Animated.View
            style={[s.viewfinder, { borderColor: accent }, ringStyle]}
          >
            {/* Radial glow */}
            <View
              pointerEvents="none"
              style={[
                s.vfGlow,
                {
                  backgroundColor: isSuccess
                    ? 'rgba(22,163,74,0.12)'
                    : 'rgba(26,86,255,0.12)',
                },
              ]}
            />

            {/* Face silhouette */}
            <View pointerEvents="none" style={s.vfCenter}>
              <Svg width={140} height={160} viewBox="0 0 140 160" fill="none" opacity={0.15}>
                <Ellipse cx={70} cy={65} rx={38} ry={48} fill="white" />
                <Path
                  d="M20 160C20 130 42 115 70 115C98 115 120 130 120 160"
                  fill="white"
                />
              </Svg>
            </View>

            {/* Dashed rotating oval */}
            <Animated.View
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, ovalStyle]}
            >
              <Svg width={VF} height={VF} viewBox={`0 0 ${VF} ${VF}`}>
                <Ellipse
                  cx={VF / 2}
                  cy={VF / 2}
                  rx={90}
                  ry={110}
                  fill="none"
                  stroke={isSuccess ? '#16A34A' : 'white'}
                  strokeWidth={2.5}
                  strokeDasharray="8 5"
                  opacity={isSuccess ? 0.8 : 0.6}
                />
              </Svg>
            </Animated.View>

            {/* Corner brackets */}
            {(
              [
                { left: 48, top: 28, d: 'M0,24 L0,0 L24,0' },
                { left: 208, top: 28, d: 'M0,0 L24,0 L24,24' },
                { left: 48, top: 228, d: 'M0,0 L0,24 L24,24' },
                { left: 208, top: 228, d: 'M0,24 L24,24 L24,0' },
              ] as const
            ).map(({ left, top, d }, i) => (
              <View key={i} style={[s.bracket, { left, top }]} pointerEvents="none">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={d}
                    stroke={accent}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            ))}

            {/* Scan line with gradient */}
            <Animated.View
              pointerEvents="none"
              style={[s.scanLine, scanLineStyle]}
            >
              <Svg width={180} height={4} viewBox="0 0 180 4">
                <Defs>
                  <LinearGradient
                    id="scanGradStep3"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                  >
                    <Stop offset="0" stopColor="#1A56FF" stopOpacity="0" />
                    <Stop offset="0.5" stopColor="#1A56FF" stopOpacity="1" />
                    <Stop offset="1" stopColor="#1A56FF" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Rect x={0} y={1} width={180} height={2} fill="url(#scanGradStep3)" />
              </Svg>
            </Animated.View>

            {/* Success overlay */}
            <Animated.View
              pointerEvents="none"
              style={[s.successOverlay, successStyle]}
            >
              <View style={s.successCircle}>
                <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                  <Path
                    d="M7 16L13 22L25 10"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </Animated.View>
          </Animated.View>
        </View>

        {/* ── Status pill ─────────────────────────────────────── */}
        <View style={s.pillWrap}>
          {verifyState === 'scanning' && (
            <View style={[s.pillInner, s.pillBlue]}>
              <Animated.View style={[s.pillDot, dotStyle]} />
              <Text style={s.pillText}>Scanning… Position your face in the oval</Text>
            </View>
          )}
          {verifyState === 'processing' && (
            <View style={[s.pillInner, s.pillBlue]}>
              <Animated.View style={spinStyle}>
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <Path
                    d="M9 2C5.1 2 2 5.1 2 9"
                    stroke="#1A56FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <Circle cx={9} cy={2} r={1.5} fill="#1A56FF" />
                </Svg>
              </Animated.View>
              <Text style={s.pillText}>Verifying your face…</Text>
            </View>
          )}
          {verifyState === 'success' && (
            <View style={[s.pillInner, s.pillGreen]}>
              <CheckCircleIcon size={18} color="#16A34A" />
              <Text style={[s.pillText, { color: '#4ADE80' }]}>
                Face Verified Successfully!
              </Text>
            </View>
          )}
        </View>

        {/* ── Instructions ────────────────────────────────────── */}
        <View style={s.instructions}>
          <View style={s.instructionRow}>
            <EyeIcon size={18} color="#1A56FF" />
            <Text style={s.instrText}>Look directly at the camera</Text>
          </View>
          <View style={s.instructionRow}>
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Circle cx={9} cy={9} r={3} stroke="#1A56FF" strokeWidth="1.5" />
              <Line x1="9" y1="1" x2="9" y2="3" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="9" y1="15" x2="9" y2="17" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="1" y1="9" x2="3" y2="9" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="15" y1="9" x2="17" y2="9" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="3.05" y1="3.05" x2="4.46" y2="4.46" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="13.54" y1="13.54" x2="14.95" y2="14.95" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="3.05" y1="14.95" x2="4.46" y2="13.54" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
              <Line x1="13.54" y1="4.46" x2="14.95" y2="3.05" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
            </Svg>
            <Text style={s.instrText}>Make sure you are in good lighting</Text>
          </View>
          <View style={s.instructionRow}>
            <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
              <Circle cx={9} cy={9} r={7} stroke="#1A56FF" strokeWidth="1.5" />
              <Line x1="3.5" y1="3.5" x2="14.5" y2="14.5" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" />
            </Svg>
            <Text style={s.instrText}>Remove glasses or face coverings</Text>
          </View>
        </View>

        <PrivacyNote
          text="Face data is used only for verification and never stored or shared"
          textStyle={s.privacyText}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom button */}
      <View style={[s.btnWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          label="Complete Registration"
          onPress={() => router.replace('/(user)/' as any)}
          disabled={!isSuccess}
          icon={
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Circle cx={10} cy={10} r={8} fill={isSuccess ? 'rgba(255,255,255,0.3)' : '#4A4A5A'} />
              <Path
                d="M6.5 10L9 12.5L13.5 7.5"
                stroke={isSuccess ? 'white' : '#1E1E2E'}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D0D' },

  blobTL: {
    position: 'absolute', top: -40, left: -40,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(26,86,255,0.08)',
  },
  blobBR: {
    position: 'absolute', bottom: 60, right: -40,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(26,86,255,0.08)',
  },
  blobMid: {
    position: 'absolute', top: 280,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(26,86,255,0.06)',
  },

  scrollContent: { paddingHorizontal: 20 },

  header: { paddingTop: 20 },
  eyebrow: {
    fontSize: 11, fontWeight: '600', color: '#1A56FF',
    letterSpacing: 2, marginBottom: 6,
  },
  title: {
    fontSize: 28, fontWeight: '700', color: 'white',
    lineHeight: 34, marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: '#94A3B8', lineHeight: 21 },

  vfWrap: { alignItems: 'center', marginTop: 24 },
  viewfinder: {
    width: VF, height: VF, borderRadius: VF / 2,
    borderWidth: 3, backgroundColor: '#1A1A2E', overflow: 'hidden',
    shadowColor: '#1A56FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
  },
  vfGlow: {
    position: 'absolute',
    top: VF / 2 - 100, left: VF / 2 - 100,
    width: 200, height: 200, borderRadius: 100,
  },
  vfCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  bracket: { position: 'absolute', width: 24, height: 24 },
  scanLine: { position: 'absolute', left: 50, width: 180, height: 4 },
  successOverlay: {
    position: 'absolute',
    top: VF / 2 - 32, left: VF / 2 - 32,
  },
  successCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 8,
  },

  pillWrap: { alignItems: 'center', marginTop: 20 },
  pillInner: {
    borderRadius: 100, paddingHorizontal: 20, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  pillBlue: { backgroundColor: '#1A2340' },
  pillGreen: { backgroundColor: '#052E16' },
  pillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1A56FF' },
  pillText: { fontSize: 14, fontWeight: '600', color: 'white' },

  instructions: { marginTop: 16, gap: 12 },
  instructionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  instrText: { fontSize: 13, color: '#94A3B8' },

  privacyText: { fontSize: 12, color: '#64748B', lineHeight: 17 },

  btnWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12,
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1, borderTopColor: '#1A1A1A',
  },
});
