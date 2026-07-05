import { useCallback, useMemo, useState } from "react";
import { Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";

import { DEVICES } from "@/data/devices";
import WarningBanner from "@/components/tracking/report-stolen/WarningBanner";
import DeviceSelectorCard from "@/components/tracking/report-stolen/DeviceSelectorCard";
import IncidentDetailsCard from "@/components/tracking/report-stolen/IncidentDetailsCard";
import LegalCheckbox from "@/components/tracking/report-stolen/LegalCheckbox";
import SubmitButton from "@/components/tracking/report-stolen/SubmitButton";
import ConsequencesModal from "@/components/tracking/report-stolen/ConsequencesModal";
import MapLocationModal from "@/components/tracking/report-stolen/MapLocationModal";
import SuccessScreen from "@/components/tracking/report-stolen/SuccessScreen";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type ToggleMode = "devices" | "imei";

export default function ReportStolenScreen() {
  const insets = useSafeAreaInsets();

  const [selectedId, setSelectedId] = useState(DEVICES[0]?.id ?? "");
  const [imeiMode, setImeiMode] = useState(false);
  const [imeiValue, setImeiValue] = useState("");
  const [imeiVerified, setImeiVerified] = useState(false);
  const [imeiFocused, setImeiFocused] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [dateFocused, setDateFocused] = useState(false);
  const [description, setDescription] = useState("");
  const [descFocused, setDescFocused] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const selectedDevice = useMemo(
    () => DEVICES.find((d) => d.id === selectedId) ?? DEVICES[0],
    [selectedId],
  );

  const canSubmit = (imeiMode ? imeiVerified : !!selectedId) && confirmed;

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleToggleMode = useCallback((mode: ToggleMode) => {
    setImeiMode(mode === "imei");
    setImeiVerified(false);
    setImeiValue("");
  }, []);

  const handleImeiChange = useCallback((v: string) => {
    const cleaned = v.replace(/\D/g, "");
    setImeiValue(cleaned);
    setImeiVerified(false);
  }, []);

  const handleVerifyImei = useCallback(() => {
    if (imeiValue.length === 15) {
      setImeiVerified(true);
    }
  }, [imeiValue]);

  const handleDateChange = useCallback((date: Date) => {
    setDateValue(date);
    setDateFocused(false);
  }, []);

  const handleUploadPress = useCallback(() => {
    Alert.alert(
      "Upload Police Report",
      "Select a file to upload.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Choose File",
          onPress: () => {
            setUploadedFile("police_report.pdf");
          },
        },
      ],
    );
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
  }, []);

  const handleConfirmToggle = useCallback(() => {
    setConfirmed((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit || pressing) return;
    setPressing(true);
    Keyboard.dismiss();
    setTimeout(() => {
      setPressing(false);
      setSubmitted(true);
    }, 900);
  }, [canSubmit, pressing]);

  const handleViewCase = useCallback(() => {
    router.back();
  }, []);

  const handleBackToTrack = useCallback(() => {
    router.back();
  }, []);

  if (submitted) {
    return <SuccessScreen device={selectedDevice} onViewCase={handleViewCase} onBackToTrack={handleBackToTrack} />;
  }

  return (
    <View style={s.screen}>
      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Report Stolen Device</Text>
        <View style={s.spacer} />
      </View>

      <WarningBanner onInfoPress={() => setShowModal(true)} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DeviceSelectorCard
          devices={DEVICES}
          selectedId={selectedId}
          imeiMode={imeiMode}
          imeiValue={imeiValue}
          imeiVerified={imeiVerified}
          imeiFocused={imeiFocused}
          onSelectDevice={handleSelectDevice}
          onToggleMode={handleToggleMode}
          onImeiChange={handleImeiChange}
          onImeiFocus={() => setImeiFocused(true)}
          onImeiBlur={() => setImeiFocused(false)}
          onVerifyImei={handleVerifyImei}
        />

        <IncidentDetailsCard
          dateValue={dateValue}
          dateFocused={dateFocused}
          description={description}
          descFocused={descFocused}
          uploadedFile={uploadedFile}
          onDateChange={handleDateChange}
          onDateFocus={() => setDateFocused(true)}
          onDateBlur={() => setDateFocused(false)}
          onDescriptionChange={setDescription}
          onDescFocus={() => setDescFocused(true)}
          onDescBlur={() => setDescFocused(false)}
          onUploadPress={handleUploadPress}
          onRemoveFile={handleRemoveFile}
          onMapPress={() => setShowMapModal(true)}
        />

        <LegalCheckbox checked={confirmed} onToggle={handleConfirmToggle} />

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[s.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <SubmitButton
          disabled={!canSubmit}
          pressing={pressing}
          onPress={handleSubmit}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
          label="Submit Stolen Report"
        />
      </View>

      <ConsequencesModal visible={showModal} onClose={() => setShowModal(false)} />
      <MapLocationModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onConfirm={() => setShowMapModal(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 20,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
});
