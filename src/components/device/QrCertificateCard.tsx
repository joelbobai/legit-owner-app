import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Certificate, QrCode, Stamp, WhatsApp, Email, Save, Print } from "./DeviceIcons";

type Props = {
  onViewPdf?: () => void;
  onShareWhatsApp?: () => void;
  onShareEmail?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
};

function QrCertificateCard({ onViewPdf, onShareWhatsApp, onShareEmail, onSave, onPrint }: Props) {
  return (
    <View style={s.card}>
      <View style={s.topGradient}>
        <LinearGradient
          colors={["#1A56FF", "#0A2ECC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.gradientBar}
        />
      </View>

      <View style={s.body}>
        <View style={s.qrSection}>
          <QrCode size={100} />
          <View style={s.qrText}>
            <Text style={s.certTitle}>Ownership Certificate</Text>
            <Text style={s.certSub}>Tap to view & download PDF</Text>
            <Pressable style={s.pdfBtn} onPress={onViewPdf}>
              <Certificate size={14} color="white" />
              <Text style={s.pdfBtnText}>View PDF</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.stampRow}>
          <Stamp size={16} />
          <Text style={s.stampText}>Verified by Legit Owner</Text>
        </View>

        <View style={s.divider} />

        <View style={s.shareRow}>
          <Text style={s.shareLabel}>Share via</Text>
          {[
            { icon: <WhatsApp size={20} />, label: "WhatsApp", onPress: onShareWhatsApp },
            { icon: <Email size={20} />, label: "Email", onPress: onShareEmail },
            { icon: <Save size={20} />, label: "Save", onPress: onSave },
            { icon: <Print size={20} />, label: "Print", onPress: onPrint },
          ].map((item, i) => (
            <Pressable key={i} style={s.shareItem} onPress={item.onPress}>
              {item.icon}
              <Text style={s.shareItemLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  gradientBar: {
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  body: {
    padding: 18,
  },
  qrSection: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  qrText: {
    flex: 1,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0D0D0D",
    lineHeight: 20,
  },
  certSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
    lineHeight: 18,
  },
  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1A56FF",
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginTop: 12,
    alignSelf: "flex-start",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pdfBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  stampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
    justifyContent: "flex-end",
  },
  stampText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1A56FF",
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  shareLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginRight: 4,
  },
  shareItem: {
    alignItems: "center",
    gap: 3,
  },
  shareItemLabel: {
    fontSize: 9,
    color: "#94A3B8",
  },
});

export default memo(QrCertificateCard);
