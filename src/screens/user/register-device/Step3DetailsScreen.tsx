import { useCallback, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { AppBar, StepBadge } from "@/components/AppBar";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import FloatingInput from "@/components/register-device/FloatingInput";
import DropdownField from "@/components/register-device/DropdownField";
import ConditionSelector from "@/components/register-device/ConditionSelector";
import DatePickerField from "@/components/register-device/DatePickerField";
import TextAreaField from "@/components/register-device/TextAreaField";
import PhotoUploadCard from "@/components/register-device/PhotoUploadCard";
import AutoFilledNotice from "@/components/register-device/AutoFilledNotice";
import { STORAGE_OPTIONS, COLOR_OPTIONS } from "@/data/deviceFormOptions";
import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

const { width: SW } = Dimensions.get("window");

export default function Step3DetailsScreen() {
  const insets = useSafeAreaInsets();
  const { data, updateDetails } = useDeviceRegistration();
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);

  const isReady =
    data.brand.trim().length > 0 &&
    data.model.trim().length > 0 &&
    data.condition.length > 0;

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleNext = useCallback(() => {
    if (isReady) {
      router.push("/(user)/register-device/step4" as any);
    }
  }, [isReady]);

  const handleAddPhoto = useCallback((i: number) => {
    setPhotos((p) => {
      const n = [...p];
      n[i] = "photo";
      return n;
    });
  }, []);

  const handleRemovePhoto = useCallback((i: number) => {
    setPhotos((p) => {
      const n = [...p];
      n[i] = null;
      return n;
    });
  }, []);

  return (
    <View style={s.screen}>
      <Svg
        width={SW}
        height="844"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="s3Dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width={SW} height="844" fill="url(#s3Dots)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <AppBar
        title="Register a Device"
        onBack={handleBack}
        right={<StepBadge label="3 of 4" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressHeader current={3} total={4} />

        <View style={s.body}>
          <Text style={s.heading}>Device Information</Text>
          <Text style={s.subheading}>
            Fill in the details below. Some fields are auto-filled from IMEI
            verification.
          </Text>
        </View>

        <View style={s.formCard}>
          <AutoFilledNotice />

          <FloatingInput
            label="Brand"
            value={data.brand}
            onChangeText={(v) => updateDetails({ brand: v })}
            prefill
            placeholder="e.g. Samsung"
          />

          <FloatingInput
            label="Model"
            value={data.model}
            onChangeText={(v) => updateDetails({ model: v })}
            prefill
            placeholder="e.g. Galaxy A54"
          />

          <DropdownField
            label="Color"
            value={data.color}
            options={COLOR_OPTIONS}
            onSelect={(v) => updateDetails({ color: v })}
            placeholder="Select color"
          />

          <DropdownField
            label="Storage Capacity"
            value={data.storage}
            options={STORAGE_OPTIONS}
            onSelect={(v) => updateDetails({ storage: v })}
            placeholder="Select storage"
          />

          <ConditionSelector
            value={data.condition}
            onSelect={(v) => updateDetails({ condition: v })}
          />

          <DatePickerField
            value={data.purchaseDate}
            onChange={(v) => updateDetails({ purchaseDate: v })}
          />

          <TextAreaField
            label="Optional Notes"
            value={data.notes}
            onChangeText={(v) => updateDetails({ notes: v })}
            placeholder="Any additional notes (e.g. purchase receipt number, previous owner, etc.)"
          />
        </View>

        <View style={s.photoCardWrap}>
          <PhotoUploadCard
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
          />
        </View>
      </ScrollView>

      <View style={s.bottomArea}>
        <LinearGradient
          colors={["transparent", "#F5F7FA"]}
          style={s.bottomGradient}
          pointerEvents="none"
        />
        <View style={s.bottomContent}>
          <Pressable
            style={[s.nextBtn, !isReady && s.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!isReady}
          >
            <LinearGradient
              colors={
                isReady ? ["#1A56FF", "#0A2ECC"] : ["#CBD5E1", "#CBD5E1"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.nextBtnGrad}
            >
              <Text style={s.nextBtnText}>Review & Pay</Text>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
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
  scrollContent: { paddingBottom: 240 },

  body: { paddingHorizontal: 20, paddingTop: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 8,
    lineHeight: 22,
  },

  formCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  photoCardWrap: {
    marginHorizontal: 20,
    marginTop: 16,
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
