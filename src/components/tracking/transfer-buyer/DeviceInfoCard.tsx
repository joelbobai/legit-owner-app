import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function PhoneIcon() {
  return (
    <Svg width="64" height="64" viewBox="0 0 48 48" fill="none">
      <Rect x="14" y="4" width="20" height="40" rx="5" stroke="#1A56FF" strokeWidth="2" fill="none" />
      <Circle cx="24" cy="38" r="2" fill="#1A56FF" />
      <Rect x="19" y="10" width="10" height="2" rx="1" fill="#1A56FF" opacity="0.3" />
    </Svg>
  );
}

function CopyIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Rect x="4.5" y="4.5" width="9" height="9" rx="1.5" stroke="#1A56FF" strokeWidth="1.3" fill="none" />
      <Path d="M2 11.5V3.5C2 2.7 2.7 2 3.5 2H11.5" stroke="#1A56FF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function CalendarIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Rect x="1.5" y="3.5" width="11" height="9.5" rx="1.5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
      <Path d="M4.5 1.5V3.5M9.5 1.5V3.5M1.5 6.5H12.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function VerifiedIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="#16A34A" />
      <Path d="M7.5 12L10.5 15L16.5 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"}>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={filled ? "none" : "#CBD5E1"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SellerAvatar({ initials }: { initials: string }) {
  return (
    <View style={s.avatar}>
      <Text style={s.avatarText}>{initials}</Text>
    </View>
  );
}

export type DeviceData = {
  id: string;
  name: string;
  brand: string;
  storage: string;
  color: string;
  os: string;
  imei: string;
  condition: string;
  verified: boolean;
  registeredDate: string;
  sellerName: string;
  sellerInitials: string;
  sellerVerified: boolean;
  trustScore: number;
};

type Props = {
  device: DeviceData;
};

function DeviceInfoCard({ device }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={s.card}>
      <View style={s.thumbnailArea}>
        <View style={s.thumbnail}>
          <PhoneIcon />
        </View>
        <View style={s.thumbnailInfo}>
          <Text style={s.deviceName}>{device.name}</Text>
          <Text style={s.deviceSpecs}>
            {device.brand} · {device.storage} · {device.color}
          </Text>
          <Text style={s.deviceOs}>{device.os}</Text>
        </View>
      </View>

      <View style={s.divider} />

      <View style={s.imeiRow}>
        <Text style={s.imeiLabel}>IMEI</Text>
        <Text style={s.imeiValue}>{device.imei}</Text>
        <Pressable style={s.copyBtn} hitSlop={6}>
          <CopyIcon />
        </Pressable>
      </View>

      <View style={s.divider} />

      <View style={s.badgesRow}>
        <View style={s.conditionBadge}>
          <Text style={s.conditionText}>{device.condition}</Text>
        </View>
        {device.verified && (
          <View style={s.verifiedBadge}>
            <VerifiedIcon />
            <Text style={s.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={s.dateRow}>
        <CalendarIcon />
        <Text style={s.dateText}>Registered {device.registeredDate}</Text>
      </View>

      <View style={s.divider} />

      <View style={s.sellerSection}>
        <Text style={s.sellerLabel}>Seller</Text>
        <View style={s.sellerRow}>
          <SellerAvatar initials={device.sellerInitials} />
          <View style={s.sellerInfo}>
            <Text style={s.sellerName}>{device.sellerName}</Text>
            {device.sellerVerified && (
              <View style={s.sellerVerifiedChip}>
                <VerifiedIcon />
                <Text style={s.sellerVerifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={s.trustScoreWrap}>
            <View style={s.starsRow}>
              {stars.map((s) => (
                <StarIcon key={s} filled={s <= device.trustScore} />
              ))}
            </View>
            <Text style={s.trustScoreLabel}>{device.trustScore}.0 Trust Score</Text>
          </View>
        </View>
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
  thumbnailArea: {
    flexDirection: "row",
    gap: 14,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  thumbnailInfo: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  deviceName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0D0D0D",
  },
  deviceSpecs: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 3,
  },
  deviceOs: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  imeiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  imeiLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  imeiValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0D0D0D",
    fontVariant: ["tabular-nums"],
    flex: 1,
  },
  copyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
  },
  conditionBadge: {
    backgroundColor: "#F1F5F9",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16A34A",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
  },
  dateText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  sellerSection: {
    gap: 8,
  },
  sellerLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },
  sellerInfo: {
    flex: 1,
    minWidth: 0,
  },
  sellerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  sellerVerifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  sellerVerifiedText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16A34A",
  },
  trustScoreWrap: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  starsRow: {
    flexDirection: "row",
    gap: 1,
  },
  trustScoreLabel: {
    fontSize: 9,
    color: "#94A3B8",
    marginTop: 2,
  },
});

export default memo(DeviceInfoCard);
