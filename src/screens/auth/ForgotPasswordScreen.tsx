import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { EnvelopeIcon, InfoIcon, LockBadgeIcon, SendIcon } from '@/components/Icon';

import { AppBar, HelpButton } from '@/components/AppBar';
import { BackgroundBlobs } from '@/components/BackgroundBlobs';
import { BottomActionBar } from '@/components/BottomActionBar';
import { DotGrid } from '@/components/DotGrid';
import { FloatingField } from '@/components/FloatingField';
import { FormCard } from '@/components/FormCard';
import { PrimaryButton } from '@/components/PrimaryButton';

function EnvelopeIllustration() {
  return (
    <View style={s.illustWrap}>
      <View style={s.illustRing} />
      <Svg width={100} height={80} viewBox="0 0 100 80" fill="none">
        <Defs>
          <LinearGradient id="envG" x1="2" y1="8" x2="98" y2="72" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#3B74FF" />
            <Stop offset="100%" stopColor="#0A2ECC" />
          </LinearGradient>
        </Defs>
        <Rect x="2" y="8" width="96" height="64" rx="8" fill="url(#envG)" />
        <Path d="M2 16L50 46L98 16" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <Path d="M2 44L30 56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <Path d="M98 44L70 56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </Svg>
      <View style={s.lockBadge}>
        <LockBadgeIcon size={18} color="#1A56FF" />
      </View>
    </View>
  );
}

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.screen}>
        <DotGrid id="dotsFP1" />
        <BackgroundBlobs />

        <View style={{ height: insets.top }} />
        <AppBar
          title="Reset Password"
          onBack={() => router.back()}
          right={<HelpButton />}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <EnvelopeIllustration />
          <Text style={s.title}>Forgot your password?</Text>
          <Text style={s.sub}>
            No worries! Enter your registered phone number or email and we'll send you a reset code
          </Text>

          <FormCard style={s.card}>
            <FloatingField
              label="Phone Number or Email"
              value={contact}
              placeholder="Enter your phone or email"
              onChangeText={setContact}
              keyboardType="email-address"
              autoCapitalize="none"
              renderIcon={(focused) => {
                const c = focused ? '#1A56FF' : '#94A3B8';
                return <EnvelopeIcon size={20} color={c} />;
              }}
            />
            <View style={s.hintRow}>
              <InfoIcon size={14} color="#94A3B8" />
              <Text style={s.hintText}>We'll send a 6-digit code to this contact</Text>
            </View>
          </FormCard>
        </ScrollView>

        <BottomActionBar paddingBottom={insets.bottom + 16}>
          <Pressable style={s.loginLink} onPress={() => router.back()}>
            <Text style={s.loginLinkMuted}>Remembered it? </Text>
            <Text style={s.loginLinkAccent}>Login Instead →</Text>
          </Pressable>
          <PrimaryButton
            label="Send Reset Code"
            onPress={() => router.push('/(auth)/otp-verify' as any)}
            icon={<SendIcon size={20} />}
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
  lockBadge: {
    position: 'absolute', bottom: 28, right: 24,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'white', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },

  title: {
    fontSize: 26, fontWeight: '700', color: '#0D0D0D',
    textAlign: 'center', marginTop: 16, marginBottom: 10,
  },
  sub: {
    fontSize: 14, color: '#4A4A4A', textAlign: 'center',
    lineHeight: 22, maxWidth: 320,
  },

  card: { marginTop: 24, width: '100%' },
  hintRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintText: { fontSize: 12, color: '#94A3B8' },

  loginLink: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  loginLinkMuted: { fontSize: 14, color: '#94A3B8' },
  loginLinkAccent: { fontSize: 14, fontWeight: '700', color: '#1A56FF' },
});
