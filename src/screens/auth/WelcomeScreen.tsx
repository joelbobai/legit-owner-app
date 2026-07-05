import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
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
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from 'react-native-svg';

import { CheckmarkIcon, LockBadgeIcon, LoginIcon, UserPlusIcon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';

function useFloat(amplitude: number, period: number) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: period / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: period / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);
  return useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
}

function MiniShield() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
      <Defs>
        <LinearGradient id="ms1" x1="8.5" y1="3" x2="27.5" y2="30.5" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#1A56FF" />
        </LinearGradient>
        <LinearGradient id="ms2" x1="14.8" y1="12.2" x2="21.2" y2="21.2" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#EEF3FF" />
          <Stop offset="100%" stopColor="#BFDBFE" />
        </LinearGradient>
      </Defs>
      <Path d="M18 3L27.5 7.2V17C27.5 23 23.5 28 18 30.5C12.5 28 8.5 23 8.5 17V7.2Z" fill="url(#ms1)" />
      <Rect x="13.5" y="11" width="9" height="13" rx="2" fill="white" opacity={0.9} />
      <Rect x="14.8" y="12.2" width="6.4" height="9" rx="1.2" fill="url(#ms2)" />
      <Rect x="16.2" y="22.5" width="3.6" height="0.8" rx="0.4" fill="white" opacity={0.5} />
      <Circle cx="24.5" cy="13.5" r="4" fill="white" />
      <Circle cx="24.5" cy="13.5" r="3.2" fill="#1A56FF" />
      <Polyline
        points="22.5,13.5 24,15 26.5,11.5"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function HeroShieldSvg() {
  return (
    <Svg width={160} height={180} viewBox="0 0 160 180" fill="none">
      <Defs>
        <LinearGradient id="hs1" x1="12" y1="8" x2="148" y2="178" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#3B74FF" />
          <Stop offset="100%" stopColor="#1A56FF" />
        </LinearGradient>
        <LinearGradient id="hs2" x1="22" y1="18" x2="138" y2="168" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d="M80 8L148 36V96C148 134 118 163 80 178C42 163 12 134 12 96V36Z" fill="url(#hs1)" />
      <Path d="M80 18L138 42V96C138 128 112 154 80 168C48 154 22 128 22 96V42Z" fill="url(#hs2)" opacity={0.3} />
    </Svg>
  );
}

function HeroPhone() {
  return (
    <View style={s.heroPhone}>
      <View style={s.phoneInner}>
        <View style={[s.psBar, { height: 6, backgroundColor: '#1A56FF', opacity: 0.7, width: '80%' }]} />
        <View style={[s.psBar, { width: '60%' }]} />
        <View style={[s.psBar, { width: '70%' }]} />
        <View style={s.psCard}>
          <View style={s.psDot} />
        </View>
        <View style={s.psBar} />
        <View style={[s.psBar, { width: '80%' }]} />
      </View>
      <View style={s.phoneHomeBar} />
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const floatVerified = useFloat(6, 3000);
  const floatLock = useFloat(4, 3500);
  const floatLocation = useFloat(5, 4000);

  return (
    <View style={s.screen}>
      <View style={s.blobTR} />
      <View style={s.blobBL} />

      <SafeAreaView style={s.safeArea}>
        <View style={s.logoRow}>
          <MiniShield />
          <Text style={s.brandText}>
            <Text style={{ color: '#1A56FF' }}>LEGIT</Text>
            <Text style={{ color: '#0D0D0D' }}> OWNER</Text>
          </Text>
        </View>

        <View style={s.heroContainer}>
          <View style={s.heroBlob} />
          <View style={s.heroShieldWrap}>
            <HeroShieldSvg />
          </View>
          <HeroPhone />

          <Animated.View style={[s.badgeVerified, floatVerified]}>
            <View style={s.checkCircle}>
              <CheckmarkIcon size={10} color="white" />
            </View>
            <Text style={s.badgeVerifiedText}>Verified</Text>
          </Animated.View>

          <Animated.View style={[s.badgeIcon, s.badgeLock, floatLock]}>
            <LockBadgeIcon size={18} color="#1A56FF" />
          </Animated.View>

          <Animated.View style={[s.badgeIcon, s.badgeLocation, floatLocation]}>
            <Svg width={18} height={20} viewBox="0 0 18 20" fill="none">
              <Path d="M9 1C5.7 1 3 3.7 3 7C3 11.5 9 19 9 19C9 19 15 11.5 15 7C15 3.7 12.3 1 9 1Z" fill="#1A56FF" />
              <Circle cx="9" cy="7" r="2.5" fill="white" />
            </Svg>
          </Animated.View>
        </View>

        <View style={s.headline}>
          <Text style={s.headlineLine1}>Own It. Prove It.</Text>
          <Text style={s.headlineLine2}>Protect It.</Text>
        </View>

        <Text style={s.subtitle}>
          Register your devices and prove ownership anywhere, anytime.
        </Text>

        <View style={s.buttons}>
          <PrimaryButton
            label="Create Account"
            onPress={() => router.push('/(auth)/register/step1')}
            style={{ width: '100%' }}
            icon={<UserPlusIcon size={20} color="white" />}
          />

          <PrimaryButton
            label="Login to My Account"
            onPress={() => router.push('/(auth)/login' as any)}
            variant="outline"
            style={{ width: '100%' }}
            icon={<LoginIcon size={20} color="#1A56FF" />}
          />

          <Pressable style={({ pressed }) => [s.agentLink, pressed && { opacity: 0.7 }]}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Circle cx="6" cy="5.5" r="3" stroke="#1A56FF" strokeWidth="1.4" fill="none" />
              <Path d="M1 14C1 11.8 3.2 10 6 10" stroke="#1A56FF" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              <Circle cx="12" cy="12" r="1.2" fill="#1A56FF" />
              <Path
                d="M12 9.5V10.3M12 13.7V14.5M9.5 12H10.3M13.7 12H14.5M10.2 10.2L10.7 10.7M13.3 13.3L13.8 13.8M10.2 13.8L10.7 13.3M13.3 10.7L13.8 10.2"
                stroke="#1A56FF"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </Svg>
            <Text style={s.agentMuted}>Are you an agent? </Text>
            <Text style={s.agentAccent}>Continue as Agent →</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Text style={s.footer}>By continuing, you agree to our Terms & Privacy Policy</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' },
  safeArea: { flex: 1, alignItems: 'center' },

  blobTR: {
    position: 'absolute', top: -40, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#EEF3FF', opacity: 0.5,
  },
  blobBL: {
    position: 'absolute', bottom: 60, left: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#EEF3FF', opacity: 0.3,
  },

  logoRow: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch',
    paddingHorizontal: 20, marginTop: 16, gap: 8,
  },
  brandText: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  heroContainer: { width: 300, height: 260, marginTop: 32 },
  heroBlob: {
    position: 'absolute', top: 20, left: 20,
    width: 260, height: 220, borderRadius: 130, backgroundColor: '#EEF3FF',
  },
  heroShieldWrap: {
    position: 'absolute', top: 36, left: 70,
    shadowColor: '#1A56FF', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22, shadowRadius: 20, elevation: 10,
  },
  heroPhone: {
    position: 'absolute', top: 79, left: 116,
    width: 68, height: 110, backgroundColor: 'white',
    borderRadius: 14, padding: 5, gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 16, elevation: 8,
  },
  phoneInner: {
    flex: 1, backgroundColor: '#EEF3FF', borderRadius: 10, padding: 6, gap: 4,
  },
  psBar: { height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, width: '60%' },
  psCard: {
    height: 20, backgroundColor: 'white', borderRadius: 6, marginTop: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  psDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1A56FF' },
  phoneHomeBar: {
    width: 20, height: 3, backgroundColor: '#E2E8F0',
    borderRadius: 2, alignSelf: 'center',
  },

  badgeVerified: {
    position: 'absolute', top: 28, right: 18,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 20,
    paddingVertical: 5, paddingHorizontal: 10, gap: 5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  checkCircle: {
    width: 16, height: 16, borderRadius: 8, backgroundColor: '#1A56FF',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeVerifiedText: { fontSize: 11, fontWeight: '700', color: '#0D0D0D' },
  badgeIcon: {
    position: 'absolute', width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  badgeLock: { top: 44, left: 16 },
  badgeLocation: { bottom: 26, right: 22 },

  headline: { marginTop: 28, alignItems: 'center' },
  headlineLine1: { fontSize: 30, fontWeight: '900', color: '#0D0D0D', lineHeight: 36 },
  headlineLine2: { fontSize: 30, fontWeight: '900', color: '#1A56FF', lineHeight: 36 },

  subtitle: {
    marginTop: 12, maxWidth: 300, textAlign: 'center',
    fontSize: 15, color: '#4A4A4A', lineHeight: 23,
  },

  buttons: {
    marginTop: 32, width: '100%', alignItems: 'center',
    gap: 12, paddingHorizontal: 20,
  },
  agentLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  agentMuted: { fontSize: 14, color: '#94A3B8' },
  agentAccent: { fontSize: 14, fontWeight: '700', color: '#1A56FF' },

  footer: {
    position: 'absolute', bottom: 32, left: 0, right: 0,
    textAlign: 'center', fontSize: 11, color: '#CBD5E1',
  },
});
