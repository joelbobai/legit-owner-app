import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { DotGrid } from "@/components/DotGrid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckmarkIcon,
  ChevronRightIcon,
  CloudUploadIcon,
  DriversLicenseIcon,
  HelpIcon,
  LockBadgeIcon,
  NinCardIcon,
  PassportBookIcon,
  ScanFrameIcon,
  VotersCardIcon,
} from "@/components/Icon";
import { API_BASE_URL, ENDPOINTS } from "@/constants/api";
import { useRouter } from "expo-router";
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

// ─── ID type data ─────────────────────────────────────────────────────────────

type IdType = { id: string; label: string };

const ID_TYPES: IdType[] = [
  { id: "nin", label: "NIN Card" },
  { id: "voters", label: "Voter's Card" },
  { id: "passport", label: "Int'l Passport" },
  { id: "drivers", label: "Driver's License" },
];

type IdTypeConfig = {
  id: string;
  label: string;
  placeholder: string;
  keyboardType: "default" | "numeric";
  validate: (value: string) => boolean;
};

const ID_TYPE_CONFIGS: Record<string, IdTypeConfig> = {
  nin: {
    id: "nin",
    label: "National Identification Number (NIN)",
    placeholder: "Enter your 11-digit NIN",
    keyboardType: "numeric",
    validate: (v: string) => /^\d{11}$/.test(v),
  },
  voters: {
    id: "voters",
    label: "Voter's Card Number",
    placeholder: "Enter your Voter's Card number",
    keyboardType: "default",
    validate: (v: string) => v.length >= 5,
  },
  passport: {
    id: "passport",
    label: "International Passport Number",
    placeholder: "Enter your Passport number",
    keyboardType: "default",
    validate: (v: string) => v.length >= 5,
  },
  drivers: {
    id: "drivers",
    label: "Driver's License Number",
    placeholder: "Enter your Driver's License number",
    keyboardType: "default",
    validate: (v: string) => v.length >= 5,
  },
};

function IdIcon({
  id,
  color,
  size,
}: {
  id: string;
  color: string;
  size?: number;
}) {
  const iconSize = size ?? 24;
  switch (id) {
    case "nin":
      return <NinCardIcon size={iconSize} color={color} />;
    case "voters":
      return <VotersCardIcon size={iconSize} color={color} />;
    case "passport":
      return <PassportBookIcon size={iconSize} color={color} />;
    case "drivers":
      return <DriversLicenseIcon size={iconSize} color={color} />;
    default:
      return null;
  }
}

function IdTypeCard({
  type,
  selected,
  onPress,
}: {
  type: IdType;
  selected: boolean;
  onPress: () => void;
}) {
  const color = selected ? "#1A56FF" : "#94A3B8";
  return (
    <Pressable
      style={[styles.idCard, selected && styles.idCardSelected]}
      onPress={onPress}
    >
      <IdIcon id={type.id} color={color} />
      <Text
        style={[styles.idCardLabel, selected && styles.idCardLabelSelected]}
      >
        {type.label}
      </Text>
      {selected && (
        <View style={styles.checkBadge}>
          <CheckmarkIcon size={10} color="white" />
        </View>
      )}
    </Pressable>
  );
}

// ─── Upload box ───────────────────────────────────────────────────────────────

function UploadBox({
  uploaded,
  uploading,
  fileName,
  onPress,
}: {
  uploaded: boolean;
  uploading: boolean;
  fileName: string;
  onPress: () => void;
}) {
  if (uploading) {
    return (
      <View style={[styles.uploadBox, styles.uploadBoxDone]}>
        <ActivityIndicator size="small" color="#1A56FF" />
        <Text style={styles.uploadDoneText}>Uploading…</Text>
      </View>
    );
  }

  if (uploaded) {
    return (
      <Pressable
        style={[styles.uploadBox, styles.uploadBoxDone]}
        onPress={onPress}
      >
        <CheckCircleIcon size={32} color="#16A34A" />
        <Text style={styles.uploadDoneText} numberOfLines={1}>
          {fileName || "Document uploaded"}
        </Text>
        <Text style={styles.uploadTypes}>Tap to change</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.uploadBox} onPress={onPress}>
      <CloudUploadIcon size={36} color="#1A56FF" />
      <Text style={styles.uploadHint}>
        Tap to take a photo or upload from gallery
      </Text>
      <Text style={styles.uploadTypes}>JPG, PNG or PDF · Max 5MB</Text>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const ID_TYPE_TO_BACKEND: Record<string, string> = {
  nin: "NIN",
  voters: "VotersCard",
  passport: "Passport",
  drivers: "DriversLicense",
};

export default function Step2IdVerification() {
  "use no memo";

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [idNumber, setIdNumber] = useState("");
  const [idFocused, setIdFocused] = useState(false);
  const [selectedId, setSelectedId] = useState("nin");
  const [selectedFile, setSelectedFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = ID_TYPE_CONFIGS[selectedId];
  const isReady = config.validate(idNumber);

  const handleIdFocus = useCallback(() => {
    setIdFocused(true);
  }, []);

  const handleIdBlur = useCallback(() => {
    setIdFocused(false);
  }, []);

  const handleIdChange = useCallback(
    (t: string) => {
      const cfg = ID_TYPE_CONFIGS[selectedId];
      if (cfg.keyboardType === "numeric") {
        setIdNumber(t.replace(/\D/g, "").slice(0, 11));
      } else {
        setIdNumber(t);
      }
    },
    [selectedId],
  );

  const handleSelectId = useCallback((id: string) => {
    setSelectedId(id);
    setIdNumber("");
  }, []);

  const handlePickFile = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch {
      setError("Failed to open file picker.");
    }
  }, []);

  const readFileAsBase64 = useCallback(async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  const handleNext = useCallback(async () => {
    if (!idNumber.trim()) {
      setError("Please enter your ID number");
      return;
    }
    if (!config.validate(idNumber.trim())) {
      setError("Please enter a valid ID number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        setError("Session expired. Please start registration again.");
        setLoading(false);
        return;
      }

      let idDocumentData: string | undefined;
      let idDocumentMimeType: string | undefined;

      if (selectedFile) {
        setUploading(true);
        idDocumentData = await readFileAsBase64(selectedFile.uri);
        idDocumentMimeType = selectedFile.mimeType || "image/jpeg";
      }

      const payload: Record<string, string> = {
        idType: ID_TYPE_TO_BACKEND[selectedId],
        idNumber: idNumber.trim(),
      };

      if (idDocumentData && idDocumentMimeType) {
        payload.idDocumentData = idDocumentData;
        payload.idDocumentMimeType = idDocumentMimeType;
      }

      console.log("[Verify ID] Submitting:", {
        idType: payload.idType,
        idNumber: payload.idNumber,
        hasDocument: !!selectedFile,
      });

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.VERIFY_ID}`,
        payload,
        {
          timeout: 60000,
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("[Verify ID] Success:", response.data);

      router.push("/(auth)/register/step3" as any);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || "Verification failed. Please try again.");
        } else if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.");
        } else {
          setError("Network error. Please check your connection and try again.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("[Verify ID Error]", {
        message: err instanceof Error ? err.message : err,
        url: `${API_BASE_URL}${ENDPOINTS.VERIFY_ID}`,
        ...(axios.isAxiosError(err) && {
          code: err.code,
          status: err.response?.status,
          responseData: err.response?.data,
        }),
      });
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }, [idNumber, selectedId, selectedFile, config, router, readFileAsBase64]);

  const labelColor = idFocused ? "#1A56FF" : "#94A3B8";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screen}>
        <DotGrid id="dotsStep2" />
        <View style={styles.blobTR} />

        <View style={{ height: insets.top }} />

        {/* App bar */}
        <View style={styles.appBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={8}
          >
            <ArrowLeftIcon size={24} color="#0D0D0D" />
          </Pressable>
          <Text style={styles.appBarTitle}>Create Account</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2 of 3</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "66.66%" }]} />
        </View>
        <Text style={styles.progressLabel}>Step 2 of 3</Text>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>IDENTITY VERIFICATION</Text>
          <Text style={styles.sectionTitle}>Verify Your Identity</Text>
          <Text style={styles.sectionSub}>
            We need to confirm you are who you say you are
          </Text>

          {/* Main card */}
          <View style={styles.mainCard}>
            {/* ── ID number input ──────────────────────────────────────────
             *
             * collapsable={false} on BOTH Views:
             *   Fabric can "collapse" passthrough Views (Views with no visual
             *   role) by merging them with their parent. Collapse destroys the
             *   View's stable native ID. During the next layout pass triggered
             *   by the keyboard appearing, Android re-evaluates all responders
             *   in the viewport and can send spurious onFocus probes to every
             *   visible TextInput. A stable native ID prevents the re-evaluation.
             */}
            <View style={styles.ninOuter} collapsable={false}>
              <View
                style={[styles.ninInner, idFocused && styles.fieldFocused]}
                collapsable={false}
              >
                {/*
                 * Floating label INSIDE ninInner — this is the key fix for the
                 * "label appears behind the border" bug.
                 *
                 * When focused, fieldFocused applies elevation:3 to ninInner.
                 * On Android, elevation creates a hardware-composited layer that
                 * is painted ABOVE all lower-elevation siblings regardless of
                 * zIndex. If the label is a sibling of ninInner (outside it),
                 * the label has no elevation and is in the base layer — ninInner's
                 * border will paint over it when elevation activates.
                 *
                 * As a CHILD of ninInner the label shares the same composited
                 * layer. React Native paints children AFTER the parent's own
                 * background + border, so the label's white backgroundColor
                 * correctly "cuts through" the top border line wherever it sits.
                 *
                 * ninInner has overflow:"visible" so the label at top:-9 can
                 * extend above the 56 px container without being clipped.
                 */}
                <Text
                  style={[styles.ninFloatingLabel, { color: labelColor }]}
                  importantForAccessibility="no"
                  accessible={false}
                >
                  {config.label}
                </Text>

                <View style={styles.fieldIconWrap}>
                  <IdIcon
                    id={selectedId}
                    color={idFocused ? "#1A56FF" : "#94A3B8"}
                    size={20}
                  />
                </View>

                <TextInput
                  style={styles.ninInput}
                  value={idNumber}
                  onChangeText={handleIdChange}
                  placeholder={config.placeholder}
                  placeholderTextColor="#CBD5E1"
                  keyboardType={config.keyboardType}
                  onFocus={handleIdFocus}
                  onBlur={handleIdBlur}
                  autoCorrect={false}
                  // Unique stable string ID — Fabric uses nativeID as the key
                  // to track this TextInput across layout reconciliations.
                  // Without it, Fabric cannot reliably distinguish inputs and
                  // may dispatch focus events to the wrong one.
                  nativeID="id-field-input"
                />

                {/*
                 * onPress={() => {}} — a Pressable with NO onPress is a
                 * "half-registered" responder on Fabric/Android. It claims
                 * ownership of the touch gesture but cannot complete it, so
                 * Fabric falls back to re-evaluating the entire responder tree
                 * for that gesture. That re-evaluation dispatches focus probes
                 * to every visible TextInput in the ScrollView. Adding an empty
                 * onPress makes it a fully-registered responder that cleanly
                 * handles and terminates the gesture without a fallback.
                 */}
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

            {/* ID type selector */}
            <Text style={styles.subLabel}>Select ID Type</Text>
            <View style={styles.idRow}>
              {ID_TYPES.slice(0, 2).map((t) => (
                <IdTypeCard
                  key={t.id}
                  type={t}
                  selected={selectedId === t.id}
                  onPress={() => handleSelectId(t.id)}
                />
              ))}
            </View>
            <View style={[styles.idRow, { marginBottom: 0 }]}>
              {ID_TYPES.slice(2).map((t) => (
                <IdTypeCard
                  key={t.id}
                  type={t}
                  selected={selectedId === t.id}
                  onPress={() => handleSelectId(t.id)}
                />
              ))}
            </View>

            {/* Upload */}
            <Text style={styles.subLabel}>
              Upload Your ID Document ( Optional ){" "}
            </Text>
            <UploadBox
              uploaded={!!selectedFile}
              uploading={uploading}
              fileName={selectedFile?.fileName || ""}
              onPress={handlePickFile}
            />

            {/* Security note */}
            <View style={styles.securityNote}>
              <LockBadgeIcon size={16} color="#16A34A" />
              <Text style={styles.securityText}>
                Your ID is encrypted and never shared with third parties
              </Text>
            </View>
          </View>

          {/* What happens next card */}
          <View style={styles.nextCard}>
            <View style={styles.nextIconWrap}>
              <ScanFrameIcon size={26} color="#1A56FF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextCardTitle}>Next: Face Verification</Text>
              <Text style={styles.nextCardSub}>
                Quick liveness check — takes less than 30 seconds
              </Text>
            </View>
            <ChevronRightIcon size={20} color="#CBD5E1" />
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={[styles.bottomBtn, { paddingBottom: insets.bottom + 8 }]}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.btnNext, (!isReady || loading) && styles.btnNextDisabled]}
            onPress={handleNext}
            disabled={!isReady || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : null}
            <Text style={styles.btnNextText}>
              {loading ? "Submitting…" : "Next — Face Verification"}
            </Text>
            {!loading ? <ArrowRightIcon size={20} color="white" /> : null}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  blobTR: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EEF3FF",
    opacity: 0.4,
  },

  // App bar
  appBar: {
    height: 56,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  appBarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  stepBadge: {
    backgroundColor: "#EEF3FF",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  stepBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
  },

  // Progress
  progressTrack: {
    height: 6,
    backgroundColor: "#E2E8F0",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#1A56FF",
  },
  progressLabel: {
    textAlign: "right",
    paddingHorizontal: 20,
    paddingTop: 6,
    fontSize: 12,
    color: "#94A3B8",
  },

  // Content
  content: {
    padding: 24,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A56FF",
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D0D0D",
    lineHeight: 32,
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 21,
  },

  // Main card — elevation:4 creates a composited layer for the entire card.
  // The NIN field's ninInner gets elevation:3 on focus, which is a sub-layer
  // within the card layer. The floating label must be INSIDE ninInner (not a
  // sibling) to share the same sub-layer and paint above the border.
  mainCard: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  // NIN field outer wrapper — overflow:visible lets the floating label
  // (top:-9 relative to ninInner) extend above ninOuter without clipping.
  ninOuter: {
    overflow: "visible",
  },

  // The floating label lives INSIDE ninInner as an absolutely-positioned child.
  // It is always rendered; color and zIndex keep it on top of the border line.
  ninFloatingLabel: {
    position: "absolute",
    top: -9,
    left: 14,
    backgroundColor: "white",
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: 4,
    // zIndex within ninInner's own stacking context — paints above other
    // absolutely-positioned children inside ninInner.
    zIndex: 1,
  },

  ninInner: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    // overflow:visible is required on TWO counts:
    //   1. The floating label at top:-9 must extend above the 56 px container.
    //   2. The focus-ring shadow must not be clipped at the container boundary.
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

  fieldIconWrap: {
    paddingLeft: 14,
    paddingRight: 10,
  },

  ninInput: {
    flex: 1,
    fontSize: 15,
    color: "#0D0D0D",
    height: 56,
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  questionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  // Sub-label inside card
  subLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    marginTop: 20,
    marginBottom: 12,
  },

  // ID type grid
  idRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  idCard: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    position: "relative",
  },
  idCardSelected: {
    backgroundColor: "#EEF3FF",
    borderColor: "#1A56FF",
  },
  idCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0D0D0D",
    flex: 1,
    lineHeight: 16,
  },
  idCardLabelSelected: {
    color: "#1A56FF",
  },
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

  // Upload box
  uploadBox: {
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadBoxDone: {
    borderColor: "#16A34A",
    borderStyle: "solid",
    backgroundColor: "#F0FDF4",
  },
  uploadHint: {
    fontSize: 14,
    color: "#4A4A4A",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  uploadDoneText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },
  uploadTypes: {
    fontSize: 12,
    color: "#94A3B8",
  },

  // Security note
  securityNote: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  securityText: {
    fontSize: 13,
    color: "#4A4A4A",
  },

  // What's next card
  nextCard: {
    marginTop: 16,
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
  nextCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
    marginBottom: 3,
  },
  nextCardSub: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 18,
  },

  // Error text
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },

  // Bottom button
  bottomBtn: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  btnNext: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnNextDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnNextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
