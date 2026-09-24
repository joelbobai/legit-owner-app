import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Clipboard from "expo-clipboard";
import axios from "axios";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { AppBar, StepBadge } from "@/components/AppBar";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import IMEIInputCard from "@/components/register-device/IMEIInputCard";
import VerificationCard from "@/components/register-device/VerificationCard";
import Tooltip from "@/components/register-device/Tooltip";
import OCRActionButtons from "@/components/register-device/OCRActionButtons";

import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";
import { API_BASE_URL, ENDPOINTS } from "@/constants/api";
import { getPhoneIdentity } from "@/utils/deviceIdentity";
import { useAuth } from "@/context/AuthContext";

type VerifyState = "idle" | "loading" | "valid" | "invalid" | "stolen";

function DualImeiToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle} style={di.toggle}>
      <View style={[di.checkbox, enabled && di.checkboxActive]}>
        {enabled && (
          <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={di.title}>This device has 2 IMEI numbers</Text>
        <Text style={di.sub}>
          Dual-SIM phones have a second IMEI for the other SIM slot
        </Text>
      </View>
    </Pressable>
  );
}

const di = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#1A56FF",
    borderColor: "#1A56FF",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  sub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});

type ImeiInfo = {
  brandName?: string;
  model?: string;
  imei?: string;
};

// Opens the phone dialer with *#06# pre-filled — one tap, no typing.
// The code runs on the phone itself (no call charges, works offline).
// Devices without a dialer (e.g. some tablets) get the code copied instead.
const USSD_CODE = "*#06#";
const USSD_TEL_URL = "tel:*%2306%23";

function PhoneIcon({ size = 22, color = "#1A56FF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4H9L11 9L8 11C8.9 13.5 10.5 15.1 13 16L15 13L20 15V19C20 20.1 19.1 21 18 21C10.6 21 3 13.4 3 6C3 4.9 3.9 4 5 4Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default function Step2IMeiScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { setImei, setImei2, updateDetails } = useDeviceRegistration();

  const [digits1, setDigits1] = useState("");
  const [verifyState1, setVerifyState1] = useState<VerifyState>("idle");
  const [deviceInfo1, setDeviceInfo1] = useState<ImeiInfo | null>(null);

  const [hasDualImei, setHasDualImei] = useState(false);
  const [digits2, setDigits2] = useState("");
  const [verifyState2, setVerifyState2] = useState<VerifyState>("idle");
  const [deviceInfo2, setDeviceInfo2] = useState<ImeiInfo | null>(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ocrImageUri, setOcrImageUri] = useState<string | null>(null);
  const [ocrImageMime, setOcrImageMime] = useState<string | null>(null);

  const handleDialUssdCode = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(USSD_TEL_URL);
      if (!canOpen) throw new Error("no-dialer");
      await Linking.openURL(USSD_TEL_URL);
    } catch {
      // No phone app (tablet, simulator) — copy the code so they can
      // paste it into any phone's dialer.
      try {
        await Clipboard.setStringAsync(USSD_CODE);
      } catch {
        // clipboard unavailable — the code is visible on screen anyway
      }
      Alert.alert(
        "Code copied",
        "This device has no phone dialer. We copied *#06# — paste it into any phone's dialer to see the IMEI, then type it here.",
      );
    }
  }, []);

  const handleOCRExtraction = useCallback(async (uri: string, mime: string) => {
    setOcrLoading(true);
    setOcrImageUri(uri);
    setOcrImageMime(mime);
    try {
      // Normalize on-device first: gallery shots can be HEIC/PNG/huge.
      // JPEG @1600px is what the server reads best — and this avoids the
      // slow fetch().blob() path entirely.
      const done = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1600 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true },
      );
      if (!done.base64) throw new Error("convert failed");

      const ocrRes = await axios.post(`${API_BASE_URL}/ocr/extract-imei`, {
        imageData: done.base64,
        mimeType: "image/jpeg",
      });

      const imeis: string[] = ocrRes.data.imeis;
      if (imeis.length > 0) {
        setDigits1(imeis[0]);
        setVerifyState1("idle");
        if (imeis.length > 1) {
          setHasDualImei(true);
          setDigits2(imeis[1]);
        }
      }
    } catch {
      // silent — user can type IMEI manually
    } finally {
      setOcrLoading(false);
    }
  }, []);

  const handlePickFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images" as any],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const mime = asset.mimeType || "image/jpeg";
      setOcrImageUri(asset.uri);
      setOcrImageMime(mime);
      await handleOCRExtraction(asset.uri, mime);
    }
  }, [handleOCRExtraction]);

  const handleTakePhoto = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const mime = asset.mimeType || "image/jpeg";
      setOcrImageUri(asset.uri);
      setOcrImageMime(mime);
      await handleOCRExtraction(asset.uri, mime);
    }
  }, [handleOCRExtraction]);

  const imei1Complete = digits1.length === 15;
  const imei2Complete = digits2.length === 15;

  const imeisMatch =
    deviceInfo1 &&
    deviceInfo2 &&
    deviceInfo1.brandName?.toLowerCase() === deviceInfo2.brandName?.toLowerCase() &&
    deviceInfo1.model?.toLowerCase() === deviceInfo2.model?.toLowerCase();

  const showMismatch =
    hasDualImei &&
    verifyState1 === "valid" &&
    verifyState2 === "valid" &&
    !imeisMatch;

  const isReady = hasDualImei
    ? verifyState1 === "valid" && verifyState2 === "valid" && !!imeisMatch
    : verifyState1 === "valid";

  const verifyImeiWithApi = useCallback(
    async (digits: string, setState: (s: VerifyState) => void, setInfo: (i: ImeiInfo | null) => void) => {
      setState("loading");
      setInfo(null);
      try {
        const res = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.CHECK_IMEI}`,
          { imei: digits },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const result = res.data.imeiInfo?.result;
        if (result) {
          setState("valid");
          setInfo({
            brandName: result.brand_name,
            model: result.model,
            imei: result.imei,
          });
          updateDetails({ brand: result.brand_name, model: result.model });
        } else {
          setState("invalid");
        }
      } catch (err: any) {
        setState(err?.response?.status === 500 ? "invalid" : "invalid");
      }
    },
    [token, updateDetails],
  );

  const handleVerify1 = useCallback(() => {
    if (!imei1Complete) return;
    verifyImeiWithApi(digits1, setVerifyState1, setDeviceInfo1);
  }, [digits1, imei1Complete, verifyImeiWithApi]);

  const handleVerify2 = useCallback(() => {
    if (!imei2Complete) return;
    verifyImeiWithApi(digits2, setVerifyState2, setDeviceInfo2);
  }, [digits2, imei2Complete, verifyImeiWithApi]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleNext = useCallback(async () => {
    if (!isReady || saving) return;
    setSaving(true);
    try {
      let imeiProofImageUrl = "";

      if (ocrImageUri && ocrImageMime) {
        let base64: string;
        try {
          const done = await ImageManipulator.manipulateAsync(
            ocrImageUri,
            [{ resize: { width: 1600 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
          );
          if (!done.base64) throw new Error("compress failed");
          base64 = done.base64;
        } catch {
          const resp = await fetch(ocrImageUri);
          const blob = await resp.blob();
          const reader = new FileReader();
          base64 = await new Promise<string>((resolve, reject) => {
            reader.onerror = () => reject(new Error("read failed"));
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.readAsDataURL(blob);
          });
        }

        const uploadRes = await axios.post(
          `${API_BASE_URL}/device/upload-imei-proof`,
          { imageData: base64, mimeType: "image/jpeg" },
          { headers: { Authorization: `Bearer ${token}` }, timeout: 30000 },
        );
        imeiProofImageUrl = uploadRes.data.url;
      }

      setImei(digits1);
      if (hasDualImei) setImei2(digits2);

      // Bind the phone in hand to this record so the app can tell
      // identical phones apart later ("which device is this?").
      const identity = await getPhoneIdentity().catch(() => null);

      const deviceRes = await axios.post(
        `${API_BASE_URL}/device/smartphone`,
        {
          category: "smartphone",
          imei1: digits1,
          imei2: hasDualImei ? digits2 : undefined,
          brand: deviceInfo1?.brandName || "",
          model: deviceInfo1?.model || "",
          imeiProofImageUrl,
          platformDeviceId: identity?.platformDeviceId || undefined,
          platform: identity?.platform || undefined,
          appInstanceId: identity?.appInstanceId || undefined,
          deviceLabel: identity?.deviceLabel || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      updateDetails({
        deviceId: deviceRes.data.device._id,
        imeiProofImageUrl,
      });

      router.push("/(user)/register-device/step3" as any);
    } catch (e: any) {
      // This physical phone is already registered — stop here so the
      // user sees why instead of continuing with no record.
      const msg = e?.response?.data?.message || "";
      if (/already registered as/i.test(msg)) {
        Alert.alert("Already registered", msg);
        return;
      }
      // navigation proceeds even if save fails
      setImei(digits1);
      if (hasDualImei) setImei2(digits2);
      router.push("/(user)/register-device/step3" as any);
    } finally {
      setSaving(false);
    }
  }, [isReady, saving, ocrImageUri, ocrImageMime, token, digits1, digits2, hasDualImei, deviceInfo1, setImei, setImei2, updateDetails]);

  return (
    <View style={s.screen}>
      <Svg
        width="390"
        height="844"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="s2Dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width="390" height="844" fill="url(#s2Dots)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <AppBar
        title="Register a Device"
        onBack={handleBack}
        right={<StepBadge label="2 of 4" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressHeader current={2} total={4} />

        <View style={s.body}>
          <Text style={s.heading}>Enter Device IMEI</Text>
          <View style={s.infoRow}>
            <Text style={s.subheading}>
              Dial <Text style={s.bold}>*#06#</Text> on your phone to see your
              IMEI
            </Text>
            <Pressable
              hitSlop={8}
              onPress={() => setShowTooltip((p) => !p)}
              style={s.infoIcon}
            >
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Circle cx="8" cy="8" r="6.5" stroke="#1A56FF" strokeWidth="1.3" />
                <Path d="M8 7V11" stroke="#1A56FF" strokeWidth="1.4" strokeLinecap="round" />
                <Circle cx="8" cy="5" r="0.8" fill="#1A56FF" />
              </Svg>
            </Pressable>
            <Tooltip visible={showTooltip} />
          </View>

          {/* Tap-to-dial: opens the phone app with *#06# ready — the user
              just hits call, reads the IMEI, and comes back to type it. */}
          <Pressable onPress={handleDialUssdCode} style={s.dialCard}>
            <View style={s.dialIconWrap}>
              <PhoneIcon />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.dialCode}>*#06#</Text>
              <Text style={s.dialHint}>
                Tap to open your dialer — your IMEI pops up, then come back and type it below
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={s.inputSection}>
          <IMEIInputCard
            digits={digits1}
            onChangeDigits={(d) => { setDigits1(d); setVerifyState1("idle"); }}
            verifyState={verifyState1}
            onVerify={handleVerify1}
          />

          {(verifyState1 === "valid" ||
            verifyState1 === "invalid" ||
            verifyState1 === "stolen") && (
            <VerificationCard state={verifyState1} deviceInfo={deviceInfo1} />
          )}

          <DualImeiToggle
            enabled={hasDualImei}
            onToggle={() => setHasDualImei((p) => !p)}
          />

          {hasDualImei && (
            <View style={{ marginTop: 12 }}>
              <Text style={s.imei2Label}>IMEI 2 (second SIM slot)</Text>
              <IMEIInputCard
                digits={digits2}
                onChangeDigits={(d) => { setDigits2(d); setVerifyState2("idle"); }}
                verifyState={verifyState2}
                onVerify={handleVerify2}
              />

              {(verifyState2 === "valid" ||
                verifyState2 === "invalid" ||
                verifyState2 === "stolen") && (
                <VerificationCard state={verifyState2} deviceInfo={deviceInfo2} />
              )}
            </View>
          )}

          {showMismatch && (
            <View style={s.mismatchCard}>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Circle cx="8" cy="8" r="6.5" stroke="#DC2626" strokeWidth="1.3" />
                <Path d="M8 5V8.5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round" />
                <Circle cx="8" cy="11" r="0.8" fill="#DC2626" />
              </Svg>
              <Text style={s.mismatchText}>
                The two IMEIs do not belong to the same device. Please verify the IMEI numbers and try again.
              </Text>
            </View>
          )}

          {ocrLoading && (
            <View style={s.ocrLoading}>
              <ActivityIndicator size="small" color="#1A56FF" />
              <Text style={s.ocrLoadingText}>Scanning image for IMEI…</Text>
            </View>
          )}

          <OCRActionButtons
            onUploadScreenshot={handlePickFromGallery}
            onTakePhoto={handleTakePhoto}
          />
        </View>
      </ScrollView>

      <View style={s.bottomArea}>
        <ExpoLinearGradient
          colors={["transparent", "#F5F7FA"]}
          style={s.bottomGradient}
          pointerEvents="none"
        />
        <View style={s.bottomContent}>
          <Pressable
            style={[s.nextBtn, (!isReady || saving) && s.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!isReady || saving}
          >
            <ExpoLinearGradient
              colors={
                isReady && !saving ? ["#1A56FF", "#0A2ECC"] : ["#CBD5E1", "#CBD5E1"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.nextBtnGrad}
            >
              {saving ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={s.nextBtnText}>Continue to Device Details</Text>
                  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <Path
                      d="M4 10H16M16 10L10 4M16 10L10 16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </>
              )}
            </ExpoLinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  blobTR: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#EEF3FF",
    opacity: 0.35,
  },
  scrollContent: { paddingBottom: 220 },

  body: { paddingHorizontal: 20, paddingTop: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    position: "relative",
  },
  subheading: {
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 21,
    flex: 1,
  },
  bold: { fontWeight: "700", color: "#0D0D0D" },
  infoIcon: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dialCard: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#EEF3FF",
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dialIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  dialCode: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A56FF",
    letterSpacing: 3,
  },
  dialHint: {
    fontSize: 13,
    color: "#4A4A4A",
    lineHeight: 18,
    marginTop: 2,
  },

  inputSection: { paddingHorizontal: 20, paddingTop: 20 },
  mismatchCard: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  mismatchText: {
    flex: 1,
    fontSize: 12,
    color: "#DC2626",
    lineHeight: 18,
  },
  ocrLoading: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    backgroundColor: "#EEF3FF",
    borderRadius: 12,
  },
  ocrLoadingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
  },
  imei2Label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },

  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomGradient: { height: 40 },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#F5F7FA",
  },
  nextBtn: {
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  nextBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  nextBtnGrad: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
});
