import axios from "axios";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Pattern,
  Polyline,
  Rect,
  Stop,
} from "react-native-svg";

import { DotGrid } from "@/components/DotGrid";
import { FloatingField } from "@/components/FloatingField";
import { FormCard } from "@/components/FormCard";
import {
  EyeIcon,
  EyeSlashIcon,
  FingerprintIcon,
  LockIcon,
  LoginIcon,
  ShieldCheckOutlineIcon,
  StarVerifiedIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@/components/Icon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { API_BASE_URL, ENDPOINTS } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";

const { width: SW } = Dimensions.get("window");
const HEADER_H = 240;

// ─── Shield mark ──────────────────────────────────────────────────────────────

function ShieldMark() {
  return (
    <Svg width={52} height={52} viewBox="0 0 52 52" fill="none">
      <Defs>
        <LinearGradient
          id="lgShLogin"
          x1="19.5"
          y1="17"
          x2="32.5"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0%" stopColor="#1A56FF" />
          <Stop offset="100%" stopColor="#0A2ECC" />
        </LinearGradient>
      </Defs>
      <Path
        d="M26 4L39 9.8V24C39 33.5 33.5 41.5 26 45C18.5 41.5 13 33.5 13 24V9.8Z"
        fill="rgba(255,255,255,0.25)"
      />
      <Path
        d="M26 7L37 12.2V24C37 32.5 32 39.8 26 43C20 39.8 15 32.5 15 24V12.2Z"
        fill="white"
        opacity={0.9}
      />
      <Rect
        x="19.5"
        y="17"
        width="13"
        height="18"
        rx="2.5"
        fill="url(#lgShLogin)"
        opacity={0.9}
      />
      <Rect
        x="21"
        y="18.5"
        width="10"
        height="13"
        rx="1.5"
        fill="rgba(26,86,255,0.15)"
      />
      <Rect
        x="23"
        y="32.5"
        width="6"
        height="1.2"
        rx="0.6"
        fill="rgba(26,86,255,0.4)"
      />
      <Circle cx="33.5" cy="19.5" r="5.5" fill="white" />
      <Circle cx="33.5" cy="19.5" r="4.5" fill="#1A56FF" />
      <Polyline
        points="31,19.5 33,21.5 36,17"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Curved blue header ───────────────────────────────────────────────────────

function CurvedHeader({ topInset }: { topInset: number }) {
  return (
    <View style={{ height: HEADER_H }}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Svg width={SW} height={HEADER_H} viewBox="0 0 390 240">
          <Defs>
            <LinearGradient id="lgHdrLogin" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1A56FF" />
              <Stop offset="100%" stopColor="#0A2ECC" />
            </LinearGradient>
            <Pattern
              id="hdrLoginDots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <Circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </Pattern>
          </Defs>
          <Path
            d="M0,0 L390,0 L390,195 Q195,245 0,195 Z"
            fill="url(#lgHdrLogin)"
          />
          <Path
            d="M0,0 L390,0 L390,195 Q195,245 0,195 Z"
            fill="url(#hdrLoginDots)"
            opacity={0.04}
          />
        </Svg>
      </View>
      <View style={{ height: topInset }} />
      <View style={s.headerContent}>
        <ShieldMark />
        <Text style={s.headerBrand}>LEGIT OWNER</Text>
        <Text style={s.headerTagline}>VERIFY . TRACK . PROTECT</Text>
      </View>
    </View>
  );
}

// ─── Password field (screen-specific: owns show state) ───────────────────────

function PasswordField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (v: string) => void;
}) {
  "use no memo";

  const [show, setShow] = useState(false);

  // Stable reference — a new function on every render would bypass FloatingField's
  // memo check and force an unnecessary re-render + native prop update.
  const renderLockIcon = useCallback(
    (focused: boolean) => (
      <LockIcon size={20} color={focused ? "#1A56FF" : "#94A3B8"} />
    ),
    [],
  );

  // The toggle callback is stable so the Pressable inside FloatingField's
  // right slot doesn't get a new onPress reference on every show-state change.
  const toggleShow = useCallback(() => setShow((v) => !v), []);

  return (
    <FloatingField
      label="Password"
      value={value}
      placeholder="Enter your password"
      onChangeText={onChangeText}
      secureTextEntry={!show}
      autoCapitalize="none"
      renderIcon={renderLockIcon}
      right={
        <Pressable onPress={toggleShow} hitSlop={8}>
          {show ? (
            <EyeSlashIcon size={20} color="#94A3B8" />
          ) : (
            <EyeIcon size={20} color="#94A3B8" />
          )}
        </Pressable>
      }
    />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = useCallback(async () => {
    if (!identifier.trim()) {
      setError("Please enter your phone number or email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.LOGIN}`,
        { emailOrPhone: identifier.trim(), password },
        { timeout: 15000 },
      );

      const { token, user } = response.data;

      await login(token, user);

      router.replace("/(user)" as any);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Unable to connect. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [identifier, password, login]);

  const renderIdentifierIcon = useCallback(
    (focused: boolean) => (
      <UserCircleIcon size={20} color={focused ? "#1A56FF" : "#94A3B8"} />
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.screen}>
        <DotGrid id="dotsLogin" />
        <View style={s.blobBr} pointerEvents="none" />
        <CurvedHeader topInset={insets.top} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.welcomeTitle}>Welcome Back 👋</Text>
          <Text style={s.welcomeSub}>
            Login to access your devices and ownership records
          </Text>

          <FormCard style={s.formCard}>
            <FloatingField
              label="Phone Number or Email"
              value={identifier}
              placeholder="Enter your phone or email"
              onChangeText={setIdentifier}
              keyboardType="email-address"
              autoCapitalize="none"
              renderIcon={renderIdentifierIcon}
            />

            <PasswordField value={password} onChangeText={setPassword} />

            <Pressable
              style={s.forgotRow}
              onPress={() => router.push("/(auth)/forgot-password" as any)}
            >
              <Text style={s.forgotText}>Forgot Password?</Text>
            </Pressable>

            {error ? (
              <Text style={s.errorText}>{error}</Text>
            ) : null}

            <PrimaryButton
              label={loading ? "Logging in..." : "Login to My Account"}
              onPress={handleLogin}
              disabled={loading}
              style={{ marginTop: 12 }}
              icon={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <LoginIcon size={20} color="white" />
                )
              }
            />

            <View style={s.orRow}>
              <View style={s.orLine} />
              <Text style={s.orText}>OR</Text>
              <View style={s.orLine} />
            </View>

            <PrimaryButton
              label="Login with Biometrics"
              onPress={() => {}}
              variant="outline"
              style={{ marginTop: 0 }}
              icon={<FingerprintIcon size={24} color="#1A56FF" />}
            />
            <Text style={s.bioHint}>Fingerprint or Face ID supported</Text>

            <View style={s.trustRow}>
              <View style={s.trustItem}>
                <ShieldCheckOutlineIcon size={16} color="#16A34A" />
                <Text style={s.trustText}>Secure Login</Text>
              </View>
              <View style={s.trustItem}>
                <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <Rect
                    x="3"
                    y="7.5"
                    width="10"
                    height="7"
                    rx="1.5"
                    stroke="#1A56FF"
                    strokeWidth="1.3"
                  />
                  <Path
                    d="M5.5 7.5V5.5C5.5 4.1 6.6 3 8 3C9.4 3 10.5 4.1 10.5 5.5V7.5"
                    stroke="#1A56FF"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={s.trustText}>256-bit Encrypted</Text>
              </View>
              <View style={s.trustItem}>
                <StarVerifiedIcon size={16} color="#F59E0B" />
                <Text style={s.trustText}>Verified Platform</Text>
              </View>
            </View>
          </FormCard>

          <Pressable
            style={s.registerLink}
            onPress={() => router.push("/(auth)/register/step1" as any)}
          >
            <UserPlusIcon size={16} color="#1A56FF" />
            <Text style={s.registerMuted}>{"Don't have an account?"}</Text>
            <Text style={s.registerAccent}> Create Account</Text>
          </Pressable>

          <Text style={s.footerNote}>
            By logging in, you agree to our Terms of Service &amp; Privacy
            Policy
          </Text>

          <View style={{ height: insets.bottom + 16 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  blobBr: {
    position: "absolute",
    bottom: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EEF3FF",
    opacity: 0.6,
  },

  headerContent: { alignItems: "center", gap: 6, marginTop: 8 },
  headerBrand: {
    fontSize: 20,
    fontWeight: "900",
    color: "white",
    letterSpacing: 2,
  },
  headerTagline: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.70)",
    letterSpacing: 2,
  },

  body: { padding: 20, paddingTop: 18 },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0D0D0D",
    lineHeight: 34,
    marginBottom: 6,
  },
  welcomeSub: { fontSize: 15, color: "#4A4A4A", lineHeight: 22 },

  formCard: { marginTop: 14, gap: 16 },

  forgotRow: { alignSelf: "flex-end", marginTop: 4 },
  forgotText: { fontSize: 14, fontWeight: "600", color: "#1A56FF" },

  orRow: { marginTop: 16, flexDirection: "row", alignItems: "center" },
  orLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  orText: {
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
  },

  bioHint: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 12,
    color: "#94A3B8",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  trustRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  trustText: { fontSize: 11, color: "#4A4A4A" },

  registerLink: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  registerMuted: { fontSize: 14, color: "#4A4A4A" },
  registerAccent: { fontSize: 14, fontWeight: "700", color: "#1A56FF" },

  footerNote: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 11,
    color: "#CBD5E1",
    lineHeight: 16,
  },
});
