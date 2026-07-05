import { useCallback, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { FontFamily } from "@/constants/typography";
import { AppBar, StepBadge } from "@/components/AppBar";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import DeviceSummaryCard from "@/components/register-device/DeviceSummaryCard";
import FeeCard from "@/components/register-device/FeeCard";
import PaymentMethodSelector from "@/components/register-device/PaymentMethodSelector";
import TermsAgreement from "@/components/register-device/TermsAgreement";
import BottomCTA from "@/components/register-device/BottomCTA";
import SuccessOverlay from "@/components/register-device/SuccessOverlay";
import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

const { width: SW } = Dimensions.get("window");
const BASE_FEE = 500;
const PROMO_DISCOUNT = 100;
const VALID_PROMO = "LEGIT100";

export default function Step4ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { data, reset } = useDeviceRegistration();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = BASE_FEE - (promoApplied ? PROMO_DISCOUNT : 0);
  const isReady = paymentMethod !== null && agreed;

  const deviceName = [data.brand, data.model].filter(Boolean).join(" ") || "Device";

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleApplyPromo = useCallback(() => {
    if (promoCode.trim().toUpperCase() === VALID_PROMO) {
      setPromoApplied(true);
    }
  }, [promoCode]);

  const handleTogglePromo = useCallback(() => {
    setShowPromo((p) => !p);
  }, []);

  const handleSelectPayment = useCallback((id: string) => {
    setPaymentMethod(id);
  }, []);

  const handleToggleAgreed = useCallback(() => {
    setAgreed((a) => !a);
  }, []);

  const handlePay = useCallback(() => {
    if (!isReady) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setSuccess(true);
    }, 2000);
  }, [isReady]);

  const handleDone = useCallback(() => {
    setSuccess(false);
    reset();
    router.replace("/(user)/register-device/complete" as any);
  }, [reset]);

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
            id="s4Dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <Circle cx="1.5" cy="1.5" r="1.5" fill="#E2E8F0" />
          </Pattern>
        </Defs>
        <Rect width={SW} height="844" fill="url(#s4Dots)" />
      </Svg>
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <AppBar
        title="Register a Device"
        onBack={handleBack}
        right={<StepBadge label="4 of 4" />}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressHeader current={4} total={4} />

        <View style={s.body}>
          <Text style={s.heading}>Review & Complete</Text>
          <Text style={s.subheading}>
            Double-check everything before you pay
          </Text>
        </View>

        <DeviceSummaryCard data={data} />

        <FeeCard
          baseFee={BASE_FEE}
          discount={promoApplied ? PROMO_DISCOUNT : 0}
          promoApplied={promoApplied}
          promoCode={promoCode}
          onChangePromoCode={setPromoCode}
          onApplyPromo={handleApplyPromo}
          showPromo={showPromo}
          onTogglePromo={handleTogglePromo}
        />

        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={handleSelectPayment}
        />

        <TermsAgreement agreed={agreed} onToggle={handleToggleAgreed} />

        <View style={s.bottomSpacer} />
      </ScrollView>

      <View style={s.bottomArea}>
        <LinearGradient
          colors={["transparent", "#F5F7FA"]}
          style={s.bottomGradient}
          pointerEvents="none"
        />
        <BottomCTA
          total={total}
          paying={paying}
          disabled={!isReady}
          onPress={handlePay}
        />
      </View>

      <SuccessOverlay
        visible={success}
        deviceName={deviceName}
        totalPaid={total}
        onDone={handleDone}
      />
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
    fontFamily: FontFamily.bold,
  },
  subheading: {
    fontSize: 14,
    color: "#4A4A4A",
    marginTop: 8,
    lineHeight: 22,
    fontFamily: FontFamily.regular,
  },

  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomGradient: { height: 40 },
  bottomSpacer: { height: 20 },
});
