import { memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { FontFamily } from "@/constants/typography";

type Props = {
  baseFee: number;
  discount: number;
  promoApplied: boolean;
  promoCode: string;
  onChangePromoCode: (v: string) => void;
  onApplyPromo: () => void;
  showPromo: boolean;
  onTogglePromo: () => void;
  promoLoading?: boolean;
  promoError?: string;
};

function FeeCard({
  baseFee,
  discount,
  promoApplied,
  promoCode,
  onChangePromoCode,
  onApplyPromo,
  showPromo,
  onTogglePromo,
  promoLoading,
  promoError,
}: Props) {
  const total = baseFee - discount;

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(100)}
      style={s.card}
    >
      <View style={s.topRow}>
        <View>
          <Text style={s.title}>Registration Fee</Text>
          <Text style={s.sub}>One-time fee · Non-refundable</Text>
        </View>
        <View style={s.amountCol}>
          {promoApplied && (
            <View style={s.strikeRow}>
              <Text style={s.originalPrice}>₦{baseFee}</Text>
              <View style={s.strikeLine} />
            </View>
          )}
          <Text style={s.totalPrice}>₦{total}</Text>
        </View>
      </View>

      <View style={s.promoSection}>
        {!promoApplied ? (
          <>
            <Pressable
              onPress={onTogglePromo}
              style={s.promoToggleBtn}
            >
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <Rect
                  x="1"
                  y="4"
                  width="12"
                  height="7"
                  rx="1.5"
                  stroke="#1A56FF"
                  strokeWidth="1.2"
                  fill="none"
                />
                <Path
                  d="M4 4V3C4 1.9 4.9 1 6 1H8C9.1 1 10 1.9 10 3V4"
                  stroke="#1A56FF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M5 7H9"
                  stroke="#1A56FF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={s.promoToggleText}>
                {showPromo ? "Cancel" : "Have a promo code?"}
              </Text>
            </Pressable>
            {showPromo && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                exiting={FadeOutUp.duration(150)}
                style={s.promoInputWrap}
              >
                <View style={s.promoInputRow}>
                  <TextInput
                    value={promoCode}
                    onChangeText={onChangePromoCode}
                    placeholder="Enter promo code"
                    placeholderTextColor="#CBD5E1"
                    style={s.promoInput}
                    autoCapitalize="characters"
                  />
                  <Pressable
                    style={[s.applyBtn, promoLoading && s.applyBtnLoading]}
                    onPress={onApplyPromo}
                    disabled={promoLoading}
                  >
                    {promoLoading ? (
                      <ActivityIndicator size="small" color="#1A56FF" />
                    ) : (
                      <Text style={s.applyBtnText}>Apply</Text>
                    )}
                  </Pressable>
                </View>
                {promoError ? (
                  <Text style={s.promoError}>{promoError}</Text>
                ) : (
                  <Text style={s.promoHint}>
                    Have a promo code? Enter it above
                  </Text>
                )}
              </Animated.View>
            )}
          </>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(250)}
            style={s.promoSuccess}
          >
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <Circle cx="7" cy="7" r="6" fill="#16A34A" opacity="0.15" />
              <Path
                d="M4.5 7L6.2 8.7L9.5 5.5"
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={s.promoSuccessText}>
              PROMO APPLIED — ₦{discount} OFF · New total: ₦{total}
            </Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0D0D0D",
    fontFamily: FontFamily.semibold,
  },
  sub: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
    marginTop: 3,
  },
  amountCol: {
    alignItems: "flex-end",
  },
  strikeRow: {
    position: "relative",
  },
  originalPrice: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
  },
  strikeLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: "#DC2626",
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1A56FF",
    fontFamily: FontFamily.black,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  promoSection: {
    marginTop: 12,
  },
  promoToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  promoToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
    fontFamily: FontFamily.semibold,
  },
  promoInputWrap: {
    marginTop: 10,
  },
  promoInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0D0D0D",
    fontFamily: FontFamily.regular,
  },
  applyBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1.5,
    borderColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },
  applyBtnLoading: {
    opacity: 0.6,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A56FF",
    fontFamily: FontFamily.semibold,
  },
  promoHint: {
    fontSize: 11,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
    marginTop: 6,
  },
  promoError: {
    fontSize: 11,
    color: "#DC2626",
    fontFamily: FontFamily.regular,
    marginTop: 6,
  },
  promoSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 12,
  },
  promoSuccessText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
    fontFamily: FontFamily.bold,
  },
});

export default memo(FeeCard);
