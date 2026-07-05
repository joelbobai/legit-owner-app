import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

function ShieldCheckIcon({ color = "#16A34A", size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M7 1.5L11 3.5V7C11 10 9 12 7 13C5 12 3 10 3 7V3.5L7 1.5Z" fill={color} />
      <Path d="M5 7L6.5 8.5L9.5 5.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  name: string;
  phone: string;
  email: string;
  idVerified: boolean;
  faceVerified: boolean;
};

function ProfileHeader({ name, phone, email, idVerified, faceVerified }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.avatarWrap}>
        <View style={s.avatar}>
          <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Circle cx={22} cy={16} r={8} fill="white" opacity={0.9} />
            <Path d="M10 36C10 28 15 22 22 22C29 22 34 28 34 36" fill="white" opacity={0.85} />
          </Svg>
        </View>
        <View style={s.cameraBadge}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8Z" stroke="white" strokeWidth="2" fill="none" />
            <Path d="M3 6C3 4.9 3.9 4 5 4H8L10 2H14L16 4H19C20.1 4 21 4.9 21 6V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6Z" stroke="white" strokeWidth="2" fill="none" />
          </Svg>
        </View>
      </View>
      <Text style={s.name}>{name}</Text>
      <Text style={s.contact}>{phone}</Text>
      <Text style={s.contact}>{email}</Text>

      <View style={s.badges}>
        {idVerified && (
          <View style={[s.badge, s.badgeGreen]}>
            <ShieldCheckIcon color="#16A34A" />
            <Text style={[s.badgeText, s.badgeTextGreen]}>ID Verified</Text>
          </View>
        )}
        {faceVerified && (
          <View style={[s.badge, s.badgeBlue]}>
            <ShieldCheckIcon color="#1A56FF" />
            <Text style={[s.badgeText, s.badgeTextBlue]}>Face Verified</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    borderWidth: 3,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0D0D0D",
    textAlign: "center",
  },
  contact: {
    fontSize: 14,
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    justifyContent: "center",
  },
  badge: {
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeGreen: {
    backgroundColor: "#DCFCE7",
  },
  badgeBlue: {
    backgroundColor: "#EEF3FF",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  badgeTextGreen: {
    color: "#16A34A",
  },
  badgeTextBlue: {
    color: "#1A56FF",
  },
});

export default memo(ProfileHeader);
