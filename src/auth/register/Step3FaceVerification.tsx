import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar, StepBadge } from "@/components/AppBar";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PrivacyNote } from "@/components/PrivacyNote";
import { ProgressBar } from "@/components/ProgressBar";

export default function Step3FaceVerification() {
  const insets = useSafeAreaInsets();
  const [supported, setSupported] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [label, setLabel] = useState("Biometric");
  const [checking, setChecking] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [hasHardware, isEnrolled, types] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);
        setSupported(hasHardware);
        setEnrolled(isEnrolled);
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setLabel("Face ID");
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setLabel("Fingerprint");
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setLabel("Iris");
        }
      } catch {
        setSupported(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const handleVerify = useCallback(async () => {
    setVerifying(true);
    setError("");
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Secure your LegitOwner account",
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });
      if (result.success) {
        setVerified(true);
      } else if ("error" in result && result.error === "user_cancel") {
        setError("Verification cancelled. Try again.");
      } else {
        setError("Biometric did not match. Try again.");
      }
    } catch {
      setError("Biometric authentication failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }, []);

  const handleFinish = useCallback(() => {
    router.replace("/(user)/" as any);
  }, []);

  // Phones without biometric hardware (or nothing enrolled) skip straight
  // through — the account is created now, and the user can set an App PIN
  // later in Settings → Privacy.
  const hasBiometric = supported && enrolled;
  const canFinish = verified || !hasBiometric;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <AppBar title="Secure Account" onBack={() => router.back()} right={<StepBadge label="3 of 3" dark />} dark />
      <ProgressBar progress="100%" label="Step 3 of 3 · Final Step" dark />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.eyebrow}>DEVICE BIOMETRIC</Text>
        <Text style={s.title}>{checking ? "Checking…" : hasBiometric ? `Lock it with ${label}` : "You're all set"}</Text>
        <Text style={s.sub}>
          {checking
            ? "Checking what this phone supports…"
            : hasBiometric
              ? `Use ${label === "Face ID" ? "the Face ID you already use on this iPhone" : "the fingerprint you already use on this device"} to protect your account.`
              : "This phone has no fingerprint or Face ID set up, so we'll create your account now. You can add an App PIN anytime in Settings → Privacy."}
        </Text>

        <View style={s.card}>
          {checking ? (
            <ActivityIndicator size="small" color="#1A56FF" />
          ) : !supported ? (
            <Text style={s.warn}>No biometric sensor on this phone. Tap Create Account below — then set an App PIN in Settings → Privacy.</Text>
          ) : !enrolled ? (
            <Text style={s.warn}>No {label} enrolled. Enable it in your device Settings to use it — or tap Create Account now and set an App PIN later in Settings → Privacy.</Text>
          ) : (
            <Text style={s.ok}>{label} is ready on this device.</Text>
          )}

          {error ? <Text style={s.error}>{error}</Text> : null}
          {verified ? <Text style={s.success}>Verified — your account is secured.</Text> : null}

          {hasBiometric && !checking ? (
            <Pressable style={[s.btnBio, verifying && s.btnDisabled]} onPress={handleVerify} disabled={verifying}>
              {verifying ? <ActivityIndicator size="small" color="white" /> : null}
              <Text style={s.btnText}>{verifying ? "Waiting for biometric…" : `Verify with ${label}`}</Text>
            </Pressable>
          ) : null}
        </View>

        <PrivacyNote text="Biometric data never leaves your device. We only receive success or failure." textStyle={s.privacy} />
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[s.btnWrap, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          label={hasBiometric ? "Complete Registration" : "Create Account"}
          onPress={handleFinish}
          disabled={!canFinish}
        />
        {!canFinish ? (
          <Pressable onPress={handleFinish} style={s.skip}>
            <Text style={s.skipText}>Skip for now</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0D0D" },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  eyebrow: { fontSize: 11, fontWeight: "600", color: "#1A56FF", letterSpacing: 2, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: "700", color: "white", marginBottom: 6 },
  sub: { fontSize: 14, color: "#94A3B8", lineHeight: 21 },
  card: { marginTop: 20, backgroundColor: "#14141F", borderRadius: 16, padding: 20, gap: 12 },
  warn: { fontSize: 14, color: "#FBBF24", lineHeight: 20 },
  ok: { fontSize: 14, color: "#4ADE80", lineHeight: 20 },
  error: { fontSize: 14, color: "#F87171" },
  success: { fontSize: 14, color: "#4ADE80", fontWeight: "600" },
  btnBio: { marginTop: 8, height: 52, borderRadius: 12, backgroundColor: "#1A56FF", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnDisabled: { backgroundColor: "#3A3A4A" },
  btnText: { fontSize: 15, fontWeight: "600", color: "white" },
  privacy: { fontSize: 12, color: "#64748B", lineHeight: 17 },
  btnWrap: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: "#0D0D0D", borderTopWidth: 1, borderTopColor: "#1A1A1A" },
  skip: { marginTop: 12, alignItems: "center" },
  skipText: { fontSize: 14, color: "#94A3B8", fontWeight: "600" },
});
