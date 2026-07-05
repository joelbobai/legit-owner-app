import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { LoginIcon, ShieldCheckIcon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';

const { width: SW } = Dimensions.get('window');

const CONFETTI = [
  { left: SW * 0.205, top: 120, size: 12, color: '#1A56FF', delay: 0 },
  { left: SW * 0.795, top: 100, size: 8,  color: '#F59E0B', delay: 100 },
  { left: SW * 0.154, top: 260, size: 8,  color: '#16A34A', delay: 200 },
  { left: SW * 0.846, top: 270, size: 10, color: '#DC2626', delay: 300 },
  { left: SW * 0.308, top: 340, size: 6,  color: '#F59E0B', delay: 400 },
  { left: SW * 0.692, top: 340, size: 7,  color: '#1A56FF', delay: 500 },
  { left: SW * 0.128, top: 190, size: 6,  color: '#DC2626', delay: 600 },
  { left: SW * 0.872, top: 190, size: 9,  color: '#16A34A', delay: 700 },
  { left: SW * 0.359, top: 90,  size: 5,  color: '#F59E0B', delay: 800 },
  { left: SW * 0.641, top: 80,  size: 5,  color: '#1A56FF', delay: 900 },
];

function ConfettiDot({ left, top, size, color, delay }: (typeof CONFETTI)[0]) {
  const y = useSharedValue(0);
  const r = useSharedValue(0);

  useEffect(() => {
    const dur = 1600 + delay;
    y.value = withRepeat(
      withSequence(withTiming(-8, { duration: dur }), withTiming(8, { duration: dur })),
      -1, true,
    );
    r.value = withRepeat(
      withSequence(withTiming(0, { duration: dur }), withTiming(180, { duration: dur })),
      -1, true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }],
  }));

  return (
    <Animated.View
      style={[style, {
        position: 'absolute', left, top,
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.7,
      }]}
    />
  );
}

function SuccessCircle() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 180 });
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[s.successCircle, style]}>
      <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
        <Circle cx="40" cy="40" r="36" fill="#16A34A" />
        <Path d="M24 40L34 50L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </Animated.View>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    ty.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function ResetSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={s.screen}>
      {CONFETTI.map((c, i) => <ConfettiDot key={i} {...c} />)}

      <View style={[s.body, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }]}>
        <SuccessCircle />

        <FadeUp delay={500}>
          <Text style={s.title}>Password Reset!</Text>
        </FadeUp>

        <FadeUp delay={600}>
          <Text style={s.sub}>
            Your password has been successfully reset. You can now login with your new password.
          </Text>
        </FadeUp>

        <FadeUp delay={700}>
          <PrimaryButton
            label="Back to Login"
            onPress={() => router.replace('/(auth)/login' as any)}
            style={{ width: SW - 48, marginBottom: 16 }}
            icon={<LoginIcon size={20} color="white" />}
          />
        </FadeUp>

        <FadeUp delay={800}>
          <View style={s.secureNote}>
            <ShieldCheckIcon size={14} color="#16A34A" />
            <Text style={s.secureText}>All your devices and data are secure</Text>
          </View>
        </FadeUp>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 24, gap: 0 },

  successCircle: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#DCFCE7', borderWidth: 3, borderColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25, shadowRadius: 30, elevation: 8,
    marginBottom: 32,
  },

  title: { fontSize: 32, fontWeight: '900', color: '#0D0D0D', textAlign: 'center', marginBottom: 12 },
  sub: {
    fontSize: 15, color: '#4A4A4A', textAlign: 'center',
    maxWidth: 300, lineHeight: 24, marginBottom: 40,
  },

  secureNote: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  secureText: { fontSize: 13, color: '#4A4A4A' },
});
