import { useCallback, useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";

import { ArrowLeftIcon } from "@/components/Icon";
import { DotGrid } from "@/components/DotGrid";
import { DEVICE_CATEGORIES, DeviceCategory } from "@/data/deviceCategories";
import { CATEGORY_ICON_MAP } from "@/components/register-device/CategoryIcons";
import CategoryCard from "@/components/register-device/CategoryCard";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import { AppBar, StepBadge } from "@/components/AppBar";

import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

const { width: SW } = Dimensions.get("window");
const GRID_GAP = 12;
const H_PADDING = 20;
const GRID_ITEM_WIDTH = (SW - H_PADDING * 2 - GRID_GAP) / 2;

export default function Step1CategoryScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const { setCategory } = useDeviceRegistration();

  const isReady = selected !== null;

  const handleNext = useCallback(() => {
    if (selected) {
      setCategory(selected);
      router.push(`/(user)/register-device/step2?category=${selected}` as any);
    }
  }, [selected, setCategory]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const selectedCategory = selected
    ? DEVICE_CATEGORIES.find((c) => c.id === selected)
    : null;

  return (
    <View style={s.screen}>
      <DotGrid id="dotsRegisterStep1" />
      <Svg
        width="390"
        height="844"
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Pattern
            id="dotsStep1"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width="390" height="844" fill="url(#dotsStep1)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <AppBar
        title="Register a Device"
        onBack={handleBack}
        right={<StepBadge label="1 of 4" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProgressHeader current={1} total={4} />

        <View style={s.body}>
          <Text style={s.heading}>What type of device?</Text>
          <Text style={s.subheading}>
            Choose the category that best matches your device
          </Text>
        </View>

        <View style={s.grid}>
          {DEVICE_CATEGORIES.map((cat) => {
            const IconComponent = CATEGORY_ICON_MAP[cat.id];
            return (
              <View key={cat.id} style={{ width: GRID_ITEM_WIDTH }}>
                <CategoryCard
                  icon={IconComponent ? <IconComponent size={28} /> : null}
                  label={cat.label}
                  selected={selected === cat.id}
                  onSelect={() => setSelected(cat.id)}
                />
              </View>
            );
          })}
        </View>

        {!isReady && (
          <View style={s.hintRow}>
            <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <Circle
                cx="7"
                cy="7"
                r="6"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />
              <Path
                d="M7 6V9.5"
                stroke="#CBD5E1"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <Circle cx="7" cy="4.5" r="0.7" fill="#CBD5E1" />
            </Svg>
            <Text style={s.hintText}>Select a category to continue</Text>
          </View>
        )}
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
              colors={isReady ? ["#1A56FF", "#0A2ECC"] : ["#CBD5E1", "#CBD5E1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.nextBtnGrad}
            >
              <Text style={s.nextBtnText}>Next</Text>
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
          {selectedCategory && (
            <Text style={s.selectedInfo}>
              Selected:{" "}
              <Text style={s.selectedInfoHighlight}>
                {selectedCategory.label}
              </Text>
            </Text>
          )}
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
  scrollContent: { paddingBottom: 200 },

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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    paddingHorizontal: H_PADDING,
    paddingTop: 20,
  },

  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: "#CBD5E1",
  },

  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomGradient: {
    height: 40,
  },
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
  nextBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnGrad: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    letterSpacing: -0.2,
  },
  selectedInfo: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    color: "#94A3B8",
  },
  selectedInfoHighlight: {
    color: "#1A56FF",
    fontWeight: "600",
  },
});
