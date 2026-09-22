import { useCallback, useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Svg, { Path } from "react-native-svg";

import { DotGrid } from "@/components/DotGrid";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SectionCard } from "@/components/tracking/privacy-settings/SectionCard";
import ToggleRow from "@/components/tracking/privacy-settings/ToggleRow";
import { ToastNotification } from "@/components/tracking/privacy-settings/ToastNotification";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M7.5 4L13.5 10L7.5 16" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Action row (navigates / opens a sheet instead of toggling) ─────────────

function ActionRow({
  label,
  sub,
  status,
  danger,
  onPress,
}: {
  label: string;
  sub?: string;
  status?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.actionRow}>
      <View style={s.actionTextWrap}>
        <Text style={[s.actionLabel, danger && s.actionLabelDanger]}>{label}</Text>
        {sub && <Text style={s.actionSub}>{sub}</Text>}
      </View>
      {status && (
        <View style={s.statusBadge}>
          <Text style={s.statusBadgeText}>{status}</Text>
        </View>
      )}
      <ChevronRightIcon />
    </Pressable>
  );
}

// ─── App PIN setup sheet ────────────────────────────────────────────────────
// PIN is stored in SecureStore (iOS Keychain / Android Keystore) — it never
// leaves the device. Enforcing it at login / app start is a separate step.

type PinMode = "setup" | "change" | "remove";

function PinSheet({
  visible,
  mode,
  onClose,
  onDone,
}: {
  visible: boolean;
  mode: PinMode;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  "use no memo";

  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<"current" | "new" | "confirm">("new");
  const [current, setCurrent] = useState("");
  const [fresh, setFresh] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Reset every time the sheet opens (or the mode changes)
  useEffect(() => {
    if (visible) {
      setStage(mode === "setup" ? "new" : "current");
      setCurrent("");
      setFresh("");
      setInput("");
      setError("");
      setBusy(false);
    }
  }, [visible, mode]);

  const digitsOnly = (t: string) => t.replace(/\D/g, "").slice(0, 6);
  const needCurrent = stage === "current";
  const minLen = 4;
  const canContinue = input.length >= minLen;

  const title =
    mode === "setup" ? "Set App PIN" : mode === "change" ? "Change App PIN" : "Remove App PIN";
  const hint =
    stage === "current"
      ? "Enter your current PIN"
      : stage === "new"
        ? "Choose a 4–6 digit PIN"
        : "Enter it again to confirm";

  const handleContinue = useCallback(async () => {
    setError("");
    if (stage === "current") {
      setBusy(true);
      try {
        const saved = await SecureStore.getItemAsync("appPin");
        if (input !== saved) {
          setError("Wrong PIN. Try again.");
          return;
        }
        if (mode === "remove") {
          await SecureStore.deleteItemAsync("appPin");
          onDone("App PIN removed");
          onClose();
          return;
        }
        setCurrent(input);
        setInput("");
        setStage("new");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (stage === "new") {
      if (input.length < minLen) {
        setError("PIN must be at least 4 digits");
        return;
      }
      setFresh(input);
      setInput("");
      setStage("confirm");
      return;
    }
    // confirm
    if (input !== fresh) {
      setError("PINs don't match. Start over.");
      setFresh("");
      setInput("");
      setStage("new");
      return;
    }
    setBusy(true);
    try {
      await SecureStore.setItemAsync("appPin", input);
      onDone(mode === "change" ? "App PIN changed" : "App PIN set");
      onClose();
    } finally {
      setBusy(false);
    }
  }, [stage, input, fresh, mode, onDone, onClose]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={s.sheetOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>{title}</Text>
          <Text style={s.sheetHint}>{hint}</Text>
          <TextInput
            style={s.pinInput}
            value={input}
            onChangeText={(t) => {
              setInput(digitsOnly(t));
              setError("");
            }}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            autoFocus
            placeholder="••••"
            placeholderTextColor="#CBD5E1"
            nativeID="app-pin-input"
          />
          {error ? <Text style={s.pinError}>{error}</Text> : null}
          <View style={s.sheetBtns}>
            <Pressable onPress={onClose} style={[s.sheetBtn, s.sheetBtnGhost]}>
              <Text style={s.sheetBtnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleContinue}
              disabled={!canContinue || busy}
              style={[s.sheetBtn, s.sheetBtnPrimary, (!canContinue || busy) && s.sheetBtnDisabled]}
            >
              <Text style={s.sheetBtnPrimaryText}>
                {needCurrent && mode === "remove" ? "Remove" : "Continue"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function PrivacySettingsScreen() {
  const insets = useSafeAreaInsets();

  const [state, setState] = useState({
    showOnlineStatus: true,
    showLastSeen: true,
    showProfilePhoto: true,
    showDeviceCount: false,
    showActivityStatus: true,
    shareUsageData: true,
    personalizeRecommendations: false,
    requireBiometrics: false,
    notifyNewDeviceLogin: true,
  });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("Privacy settings saved successfully");
  const [hasChanges, setHasChanges] = useState(false);

  // ── App PIN (SecureStore fallback for phones without biometrics) ──────────
  const [pinSet, setPinSet] = useState<boolean | null>(null);
  const [pinSheet, setPinSheet] = useState<{ visible: boolean; mode: PinMode }>({
    visible: false,
    mode: "setup",
  });

  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync("appPin");
        setPinSet(!!saved);
      } catch {
        setPinSet(false);
      }
    })();
  }, []);

  const openPinSheet = useCallback((mode: PinMode) => {
    setPinSheet({ visible: true, mode });
  }, []);

  const closePinSheet = useCallback(() => {
    setPinSheet((prev) => ({ ...prev, visible: false }));
  }, []);

  const handlePinDone = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    SecureStore.getItemAsync("appPin")
      .then((v) => setPinSet(!!v))
      .catch(() => setPinSet(false));
  }, []);

  const toggle = useCallback((key: keyof typeof state) => {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    setHasChanges(false);
    setToastVisible(true);
  }, []);

  const handleHideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={s.screen}>
      <DotGrid id="dotsPrivacy" opacity={0.3} />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Privacy Settings</Text>
        <View style={s.spacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="Profile Visibility">
          <ToggleRow
            label="Show Online Status"
            sub="Let others see when you're active"
            value={state.showOnlineStatus}
            onChange={() => toggle("showOnlineStatus")}
          />
          <View style={s.rowDivider} />
          <ToggleRow
            label="Show Last Seen"
            sub="Display when you were last active"
            value={state.showLastSeen}
            onChange={() => toggle("showLastSeen")}
          />
          <View style={s.rowDivider} />
          <ToggleRow
            label="Show Profile Photo"
            value={state.showProfilePhoto}
            onChange={() => toggle("showProfilePhoto")}
          />
          <View style={s.rowDivider} />
          <ToggleRow
            label="Show Device Count"
            sub="Display number of registered devices"
            value={state.showDeviceCount}
            onChange={() => toggle("showDeviceCount")}
          />
          <View style={s.rowDivider} />
          <ToggleRow
            label="Show Activity Status"
            sub="Let buyers see your recent activity"
            value={state.showActivityStatus}
            onChange={() => toggle("showActivityStatus")}
          />
        </SectionCard>

        <SectionCard title="Data & Privacy">
          <ToggleRow
            label="Share Usage Data"
            sub="Help us improve with anonymous data"
            value={state.shareUsageData}
            onChange={() => toggle("shareUsageData")}
          />
          <View style={s.rowDivider} />
          <ToggleRow
            label="Personalize Recommendations"
            sub="Get tailored suggestions based on your activity"
            badge="New"
            value={state.personalizeRecommendations}
            onChange={() => toggle("personalizeRecommendations")}
          />
        </SectionCard>

        <SectionCard title="Security">
          <ToggleRow
            label="Require Biometrics"
            sub="Use fingerprint or Face ID for sensitive actions"
            badge="Recommended"
            value={state.requireBiometrics}
            onChange={() => toggle("requireBiometrics")}
          />
          <View style={s.rowDivider} />
          {pinSet ? (
            <>
              <ActionRow
                label="Change App PIN"
                sub="Update your 4–6 digit backup PIN"
                status="On"
                onPress={() => openPinSheet("change")}
              />
              <View style={s.rowDivider} />
              <ActionRow
                label="Remove App PIN"
                sub="Delete the backup PIN from this device"
                danger
                onPress={() => openPinSheet("remove")}
              />
              <View style={s.rowDivider} />
            </>
          ) : (
            <>
              <ActionRow
                label="Set App PIN"
                sub="4–6 digit backup for phones without fingerprint or Face ID"
                status={pinSet === null ? "…" : "Off"}
                onPress={() => openPinSheet("setup")}
              />
              <View style={s.rowDivider} />
            </>
          )}
          <ToggleRow
            label="New Device Login Alerts"
            sub="Get notified when a new device logs in"
            value={state.notifyNewDeviceLogin}
            onChange={() => toggle("notifyNewDeviceLogin")}
          />
        </SectionCard>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[s.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save Changes" onPress={handleSave} />
      </View>

      <PinSheet
        visible={pinSheet.visible}
        mode={pinSheet.mode}
        onClose={closePinSheet}
        onDone={handlePinDone}
      />

      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        onHide={handleHideToast}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    position: "relative",
  },
  topBar: {
    height: 56,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 20,
    flexShrink: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D0D0D",
    letterSpacing: -0.3,
  },
  spacer: {
    width: 44,
  },
  scroll: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 20,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 16,
  },

  // ── Action row ──────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionTextWrap: { flex: 1, minWidth: 0 },
  actionLabel: { fontSize: 15, fontWeight: "600", color: "#0D0D0D" },
  actionLabelDanger: { color: "#DC2626" },
  actionSub: { fontSize: 12, color: "#94A3B8", marginTop: 2, lineHeight: 17 },
  statusBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
  },
  statusBadgeText: { fontSize: 12, fontWeight: "600", color: "#64748B" },

  // ── PIN sheet ───────────────────────────────────────────────────────────
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#0D0D0D", textAlign: "center" },
  sheetHint: { fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 6 },
  pinInput: {
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "#0D0D0D",
    textAlign: "center",
    letterSpacing: 12,
  },
  pinError: { color: "#DC2626", fontSize: 14, textAlign: "center", marginTop: 12 },
  sheetBtns: { flexDirection: "row", gap: 12, marginTop: 20 },
  sheetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBtnGhost: { backgroundColor: "#F1F5F9" },
  sheetBtnGhostText: { fontSize: 15, fontWeight: "600", color: "#0D0D0D" },
  sheetBtnPrimary: { backgroundColor: "#1A56FF" },
  sheetBtnDisabled: { backgroundColor: "#CBD5E1" },
  sheetBtnPrimaryText: { fontSize: 15, fontWeight: "600", color: "white" },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    zIndex: 10,
  },
});
