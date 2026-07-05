import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function MailSmIcon() {
  return (
    <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="14" rx="2" stroke="#64748B" strokeWidth="1.8" fill="none" />
      <Path d="M3 7L12 13L21 7" stroke="#64748B" strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function SmsSmIcon() {
  return (
    <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <Path d="M21 12C21 16.4 17 20 12 20C10.7 20 9.4 19.8 8.3 19.4L3 21L4.6 16.7C4.2 15.8 4 14.9 4 14C4 9.6 8 6 13 6" stroke="#64748B" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="9" cy="13" r="1" fill="#64748B" />
      <Circle cx="13" cy="13" r="1" fill="#64748B" />
      <Circle cx="17" cy="13" r="1" fill="#64748B" />
    </Svg>
  );
}

function TransferFeeCard() {
  return (
    <View style={s.card}>
      <View style={s.feeRow}>
        <View>
          <Text style={s.feeTitle}>Transfer Fee</Text>
          <Text style={s.feeSub}>One-time fee · Paid by seller</Text>
        </View>
        <View style={s.amountWrap}>
          <Text style={s.amount}>₦300</Text>
          <Text style={s.currency}>NGN</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.confirmRow}>
        <View style={s.confirmItem}>
          <MailSmIcon />
          <Text style={s.confirmText}>Email</Text>
        </View>
        <View style={s.confirmItem}>
          <SmsSmIcon />
          <Text style={s.confirmText}>SMS</Text>
        </View>
        <Text style={s.confirmDesc}>confirmations sent to both parties</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  feeSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },
  amountWrap: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1A56FF",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  currency: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  confirmItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confirmText: {
    fontSize: 11,
    color: "#64748B",
  },
  confirmDesc: {
    fontSize: 11,
    color: "#94A3B8",
  },
});

export default memo(TransferFeeCard);
