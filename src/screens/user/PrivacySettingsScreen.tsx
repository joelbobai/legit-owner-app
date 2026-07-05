import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
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
  const [hasChanges, setHasChanges] = useState(false);

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

      <ToastNotification
        visible={toastVisible}
        message="Privacy settings saved successfully"
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
