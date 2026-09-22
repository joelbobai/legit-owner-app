import axios from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar, StepBadge } from "@/components/AppBar";
import { BottomActionBar } from "@/components/BottomActionBar";
import { DotGrid } from "@/components/DotGrid";
import { FormCard } from "@/components/FormCard";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckmarkIcon,
  ChevronRightIcon,
  HelpIcon,
  LockBadgeIcon,
  NinCardIcon,
  ScanFrameIcon,
  VotersCardIcon,
} from "@/components/Icon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { PrivacyNote } from "@/components/PrivacyNote";
import { ProgressBar } from "@/components/ProgressBar";
import { SectionHeader } from "@/components/SectionHeader";
import { API_BASE_URL, ENDPOINTS } from "@/constants/api";

type IdType = "NIN" | "BVN";

type VerifiedIdentity = {
  idType: IdType;
  idNumber: string;
  fullName: string;
  phone?: string;
  gender?: string;
  birthDateRaw?: string;
  photoUrl?: string | null;
};

function IdTypeIcon({ id, color }: { id: IdType; color: string }) {
  return id === "NIN" ? (
    <NinCardIcon size={24} color={color} />
  ) : (
    <VotersCardIcon size={24} color={color} />
  );
}

function IdTypeCard({
  id,
  label,
  hint,
  selected,
  onPress,
}: {
  id: IdType;
  label: string;
  hint: string;
  selected: boolean;
  onPress: () => void;
}) {
  const color = selected ? "#1A56FF" : "#94A3B8";
  return (
    <Pressable
      style={[styles.idCard, selected && styles.idCardSelected]}
      onPress={onPress}
    >
      <IdTypeIcon id={id} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.idCardLabel, selected && styles.idCardLabelSelected]}>
          {label}
        </Text>
        <Text style={styles.idCardHint}>{hint}</Text>
      </View>
      {selected && (
        <View style={styles.checkBadge}>
          <CheckmarkIcon size={10} color="white" />
        </View>
      )}
    </Pressable>
  );
}

export default function Step1IdentityLookup() {
  "use no memo";

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [idType, setIdType] = useState<IdType>("NIN");
  const [idNumber, setIdNumber] = useState("");
  const [idFocused, setIdFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [identity, setIdentity] = useState<VerifiedIdentity | null>(null);
  const [wasCached, setWasCached] = useState(false);

  const digits = idNumber.replace(/\D/g, "");
  const isValid = /^\d{11}$/.test(idNumber.trim());

  const handleChange = useCallback((t: string) => {
    setIdNumber(t.replace(/\D/g, "").slice(0, 11));
    setIdentity(null);
    setError("");
  }, []);

  const handleSelectId = useCallback((id: IdType) => {
    setIdType(id);
    setIdNumber("");
    setIdentity(null);
    setError("");
  }, []);

  const handleLookup = useCallback(async () => {
    if (!isValid) {
      setError(`Enter a valid 11-digit ${idType}`);
      return;
    }
    setLoading(true);
    setError("");
    setIdentity(null);
    try {
      const res = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.VERIFICATION_LOOKUP}`,
        { idType, idNumber: idNumber.trim() },
        { timeout: 45000 },
      );
      const found = res.data?.identity;
      if (!found?.fullName) throw new Error("Verification failed. Try again.");
      setIdentity({
        idType,
        idNumber: idNumber.trim(),
        fullName: found.fullName,
        phone: found.phone,
        gender: found.gender,
        birthDateRaw: found.birthDateRaw,
        photoUrl: found.photoUrl ?? null,
      });
      setWasCached(res.data?.cached === true);
      // Persist for Step 2 auto-fill (photoUrl only — no large base64 in SecureStore)
      await SecureStore.setItemAsync(
        "registrationIdentity",
        JSON.stringify({
          idType,
          idNumber: idNumber.trim(),
          fullName: found.fullName,
          firstName: found.firstName,
          lastName: found.lastName,
          middleName: found.middleName,
          phone: found.phone,
          gender: found.gender,
          birthDateRaw: found.birthDateRaw,
          birthDate: found.birthDate ?? null,
          photoUrl: found.photoUrl ?? null,
        }),
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Verification failed. Try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [idType, idNumber, isValid]);

  const handleNext = useCallback(() => {
    router.push("/(auth)/register/step2" as any);
  }, [router]);

  const labelColor = idFocused ? "#1A56FF" : "#94A3B8";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.screen}>
        <DotGrid id="dotsVerifyStep1" />

        <View style={{ height: insets.top }} />
        <AppBar
          title="Create Account"
          onBack={() => router.back()}
          right={<StepBadge label="1 of 3" />}
        />
        <ProgressBar progress="33.33%" label="Step 1 of 3" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SectionHeader
            eyebrow="IDENTITY FIRST"
            title={`Verify your ${idType}`}
            subtitle="Enter your number once — we'll fill your name, phone and birthday automatically."
          />

          <FormCard style={styles.card}>
            {/* ── ID type selector ─────────────────────────────────── */}
            <Text style={styles.subLabel}>Select ID Type</Text>
            <View style={styles.idRow}>
              <IdTypeCard
                id="NIN"
                label="NIN"
                hint="National ID"
                selected={idType === "NIN"}
                onPress={() => handleSelectId("NIN")}
              />
              <IdTypeCard
                id="BVN"
                label="BVN"
                hint="Bank verification"
                selected={idType === "BVN"}
                onPress={() => handleSelectId("BVN")}
              />
            </View>

            {/* ── Number input (same focus-safe pattern as Step 2) ─── */}
            <View style={styles.fieldOuter} collapsable={false}>
              <View
                style={[styles.fieldInner, idFocused && styles.fieldFocused]}
                collapsable={false}
              >
                <Text
                  style={[styles.floatingLabel, { color: labelColor }]}
                  importantForAccessibility="no"
                  accessible={false}
                >
                  {idType === "NIN" ? "National Identification Number" : "Bank Verification Number"}
                </Text>

                <View style={styles.fieldIconWrap}>
                  <IdTypeIcon id={idType} color={idFocused ? "#1A56FF" : "#94A3B8"} />
                </View>

                <TextInput
                  style={styles.fieldInput}
                  value={idNumber}
                  onChangeText={handleChange}
                  placeholder={`Enter your 11-digit ${idType}`}
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                  maxLength={11}
                  onFocus={() => setIdFocused(true)}
                  onBlur={() => setIdFocused(false)}
                  autoCorrect={false}
                  nativeID="identity-number-input"
                />

                <View style={styles.counterWrap}>
                  <Text style={[styles.counter, isValid && styles.counterDone]}>
                    {digits.length}/11
                  </Text>
                </View>

                <Pressable
                  style={styles.questionBtn}
                  onPress={() => {
                    /* TODO: show help tooltip */
                  }}
                >
                  <HelpIcon size={16} color="#1A56FF" />
                </Pressable>
              </View>
            </View>

            {/* ── Verify button ────────────────────────────────────── */}
            <PrimaryButton
              label={loading ? "Verifying…" : `Verify ${idType}`}
              onPress={handleLookup}
              disabled={!isValid || loading}
              icon={
                loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ScanFrameIcon size={20} color="white" />
                )
              }
              iconPosition="left"
              style={styles.verifyBtn}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* ── Verified result ──────────────────────────────────── */}
            {identity ? (
              <View style={styles.result}>
                {identity.photoUrl ? (
                  <Image
                    source={{ uri: identity.photoUrl }}
                    style={styles.photo}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[styles.photo, styles.photoPlaceholder]}>
                    <Text style={styles.photoPlaceholderText}>
                      {identity.idType === "BVN" ? "BVN Basic has no photo" : "No photo"}
                    </Text>
                  </View>
                )}
                <View style={styles.verifiedRow}>
                  <CheckCircleIcon size={18} color="#16A34A" />
                  <Text style={styles.verifiedText}>Identity verified</Text>
                </View>
                <Text style={styles.name}>{identity.fullName}</Text>
                {!!identity.phone && (
                  <Text style={styles.meta}>{identity.phone}</Text>
                )}
                {!!identity.birthDateRaw && (
                  <Text style={styles.meta}>Born {identity.birthDateRaw}</Text>
                )}
                {!!identity.gender && (
                  <Text style={styles.meta}>{identity.gender}</Text>
                )}
                <View
                  style={[
                    styles.cacheBadge,
                    wasCached ? styles.cacheHit : styles.cacheLive,
                  ]}
                >
                  <Text
                    style={[
                      styles.cacheText,
                      wasCached ? styles.cacheHitText : styles.cacheLiveText,
                    ]}
                  >
                    {wasCached ? "Found in our records — no charge" : "Verified live"}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* ── Security note ────────────────────────────────────── */}
            <View style={styles.securityNote}>
              <LockBadgeIcon size={16} color="#16A34A" />
              <Text style={styles.securityText}>
                Your ID is encrypted and never shared with third parties
              </Text>
            </View>
          </FormCard>

          {/* ── What happens next ──────────────────────────────────── */}
          <View style={styles.nextCard}>
            <View style={styles.nextIconWrap}>
              <ScanFrameIcon size={26} color="#1A56FF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextCardTitle}>Next: Your Details</Text>
              <Text style={styles.nextCardSub}>
                Name and birthday fill in automatically — you only add contact and password
              </Text>
            </View>
            <ChevronRightIcon size={20} color="#CBD5E1" />
          </View>

          <PrivacyNote
            text="Verification data is used only to create your account and is stored securely"
            textStyle={styles.privacyText}
          />
        </ScrollView>

        <BottomActionBar paddingBottom={insets.bottom + 8}>
          <PrimaryButton
            label="Next — Your Details"
            onPress={handleNext}
            disabled={!identity}
            icon={<ArrowRightIcon size={20} color="white" />}
            iconPosition="right"
          />
        </BottomActionBar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  content: { padding: 24, paddingBottom: 32 },
  card: { marginTop: 20, marginBottom: 20, gap: 16 },

  subLabel: { fontSize: 14, fontWeight: "600", color: "#0D0D0D" },
  idRow: { flexDirection: "row", gap: 10 },
  idCard: {
    flex: 1,
    minHeight: 72,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    position: "relative",
  },
  idCardSelected: { backgroundColor: "#EEF3FF", borderColor: "#1A56FF" },
  idCardLabel: { fontSize: 13, fontWeight: "700", color: "#0D0D0D", lineHeight: 16 },
  idCardLabelSelected: { color: "#1A56FF" },
  idCardHint: { fontSize: 11, color: "#94A3B8", marginTop: 2 },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
  },

  fieldOuter: { overflow: "visible" },
  fieldInner: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
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
  floatingLabel: {
    position: "absolute",
    top: -9,
    left: 14,
    backgroundColor: "white",
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: 4,
    zIndex: 1,
  },
  fieldIconWrap: { paddingLeft: 14, paddingRight: 10 },
  fieldInput: {
    flex: 1,
    fontSize: 16,
    color: "#0D0D0D",
    height: 56,
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
    letterSpacing: 2,
  },
  counterWrap: { paddingRight: 6 },
  counter: { fontSize: 12, fontWeight: "600", color: "#94A3B8" },
  counterDone: { color: "#16A34A" },
  questionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  verifyBtn: { marginTop: 4 },
  errorText: { color: "#DC2626", fontSize: 14, textAlign: "center", lineHeight: 20 },

  result: {
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#BBF7D0",
    padding: 20,
    gap: 4,
  },
  photo: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#E2E8F0", marginBottom: 8 },
  photoPlaceholder: { alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  photoPlaceholderText: { fontSize: 11, color: "#64748B", textAlign: "center" },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  verifiedText: { fontSize: 13, fontWeight: "700", color: "#16A34A" },
  name: { fontSize: 20, fontWeight: "700", color: "#0D0D0D", textAlign: "center" },
  meta: { fontSize: 14, color: "#4A4A4A" },
  cacheBadge: { marginTop: 8, borderRadius: 100, paddingVertical: 4, paddingHorizontal: 12 },
  cacheHit: { backgroundColor: "#DCFCE7" },
  cacheLive: { backgroundColor: "#DBEAFE" },
  cacheText: { fontSize: 12, fontWeight: "600" },
  cacheHitText: { color: "#15803D" },
  cacheLiveText: { color: "#1D4ED8" },

  securityNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  securityText: { fontSize: 13, color: "#4A4A4A" },

  nextCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  nextIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  nextCardTitle: { fontSize: 14, fontWeight: "600", color: "#0D0D0D", marginBottom: 3 },
  nextCardSub: { fontSize: 13, color: "#94A3B8", lineHeight: 18 },
  privacyText: { marginTop: 16 },
});
