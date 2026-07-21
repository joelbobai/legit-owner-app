import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Pattern, Rect } from "react-native-svg";

import { AppBar, StepBadge } from "@/components/AppBar";
import BottomCTA from "@/components/register-device/BottomCTA";
import DeviceSummaryCard from "@/components/register-device/DeviceSummaryCard";
import FeeCard from "@/components/register-device/FeeCard";
import PaymentMethodSelector from "@/components/register-device/PaymentMethodSelector";
import ProgressHeader from "@/components/register-device/ProgressHeader";
import SuccessOverlay from "@/components/register-device/SuccessOverlay";
import TermsAgreement from "@/components/register-device/TermsAgreement";
import { API_BASE_URL } from "@/constants/api";
import { FontFamily } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

const { width: SW } = Dimensions.get("window");
const BASE_FEE = 2000;

export default function Step4ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { data, reset, updateDetails } = useDeviceRegistration();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showPromo, setShowPromo] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = BASE_FEE - promoDiscount;
  const isReady = paymentMethod !== null && agreed;

  const deviceName =
    [data.brand, data.model].filter(Boolean).join(" ") || "Device";
  const ownerName = data.name || "Owner";

  useEffect(() => {
    if (!data.deviceId || !token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/device/smartphone/${data.deviceId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const device = res.data.device;
        if (!device) {
          setLoading(false);
          return;
        }

        updateDetails({
          brand: device.brand || data.brand,
          model: device.model || data.model,
          color: device.color || data.color,
          storage: device.storage || data.storage,
          os: device.operatingSystem || data.os,
          condition: device.condition || data.condition,
          purchaseDate: device.purchaseDate || data.purchaseDate,
          notes: device.notes || data.notes,
          serialNumber: device.identifiers?.serialNumber || data.serialNumber,
          modelNumber: device.identifiers?.deviceId || data.modelNumber,
          imei: device.identifiers?.imei1 || data.imei,
          imei2: device.identifiers?.imei2 || data.imei2,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [data.deviceId, token, updateDetails]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim() || promoLoading) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/promo/validate`,
        { code: promoCode, deviceFee: BASE_FEE },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPromoDiscount(res.data.discount);
      setPromoApplied(true);
    } catch (e: any) {
      setPromoError(e?.response?.data?.message || "Invalid promo code");
    } finally {
      setPromoLoading(false);
    }
  }, [promoCode, token, promoLoading]);

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

  if (loading) {
    return (
      <View style={s.screen}>
        <View style={{ height: insets.top, backgroundColor: "white" }} />
        <AppBar
          title="Register a Device"
          onBack={handleBack}
          right={<StepBadge label="4 of 4" />}
        />
        <View style={s.loadingWrap}>
          <ActivityIndicator size="large" color="#1A56FF" />
          <Text style={s.loadingText}>Loading device info...</Text>
        </View>
      </View>
    );
  }

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

        <DeviceSummaryCard data={data} ownerName={ownerName} />

        <FeeCard
          baseFee={BASE_FEE}
          discount={promoDiscount}
          promoApplied={promoApplied}
          promoCode={promoCode}
          onChangePromoCode={setPromoCode}
          onApplyPromo={handleApplyPromo}
          showPromo={showPromo}
          onTogglePromo={handleTogglePromo}
          promoLoading={promoLoading}
          promoError={promoError}
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
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
  },

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
