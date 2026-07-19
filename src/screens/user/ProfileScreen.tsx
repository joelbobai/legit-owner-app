import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

import { router } from "expo-router";
import { DotGrid } from "@/components/DotGrid";
import ProfileHeader from "@/components/tracking/profile/ProfileHeader";
import StatsCard from "@/components/tracking/profile/StatsCard";
import SettingsMenuItem from "@/components/tracking/profile/SettingsMenuItem";
import DangerZone from "@/components/tracking/profile/DangerZone";
import { useAuth } from "@/context/AuthContext";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EditIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M17 3C17.6 2.4 18.4 2 19.3 2C20.2 2 21 2.4 21.6 3C22.2 3.6 22.6 4.4 22.6 5.3C22.6 6.2 22.2 7 21.6 7L8 20L4 22L6 18L19.3 4.7" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function UserIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Circle cx={12} cy={10} r={3.5} stroke="#1A56FF" strokeWidth="1.5" fill="none" />
      <Path d="M5 19C5 16.2 8.1 14 12 14C15.9 14 19 16.2 19 19" stroke="#1A56FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={11} rx={2} stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Circle cx={12} cy={16} r={1} fill="#1A56FF" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L4 6V12C4 16.5 7.5 21 12 22.5C16.5 21 20 16.5 20 12V6L12 2Z" stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M9 12L11 14L15 10" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3C8.7 3 6 5.7 6 9V14L4 16H20L18 14V9C18 5.7 15.3 3 12 3Z" stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function CardIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={4} width={20} height={16} rx={2} stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M2 8H22" stroke="#1A56FF" strokeWidth="1.7" />
    </Svg>
  );
}

function HelpIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M12 7V12L15 14" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function DocIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6C5.5 2 5 2.5 5 3V21C5 21.5 5.5 22 6 22H18C18.5 22 19 21.5 19 21V8L14 2Z" stroke="#1A56FF" strokeWidth="1.7" fill="none" strokeLinejoin="round" />
      <Path d="M14 2V8H19" stroke="#1A56FF" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
      <Path d="M9 15H15M9 12H15M9 18H12" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" />
    </Svg>
  );
}

function PrivacyIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={8} width={18} height={12} rx={2} stroke="#1A56FF" strokeWidth="1.7" fill="none" />
      <Path d="M7 8V6C7 3.8 8.8 2 11 2H13C15.2 2 17 3.8 17 6V8" stroke="#1A56FF" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleBack = useCallback(() => {}, []);

  const fullName = user?.fullName ?? "User";
  const phone = user?.phoneNumber ?? "";
  const email = user?.email ?? "";
  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A";

  return (
    <View style={s.screen}>
      <DotGrid id="dotsProfile" opacity={0.3} />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>My Profile</Text>
        <View style={s.editBtn}>
          <EditIcon />
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={fullName}
          phone={phone}
          email={email}
          idVerified={user?.verificationStatus === "id_submitted" || user?.verificationStatus === "verified"}
          faceVerified={user?.faceVerified ?? false}
        />

        <StatsCard deviceCount={3} memberSince={memberSince} />

        <View style={s.settingsCard}>
          <SettingsMenuItem icon={<UserIcon />} label="Edit Profile" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<LockIcon />} label="Change Password" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<ShieldIcon />} label="Privacy Settings" onPress={() => router.push("/(user)/privacy-settings")} />
          <View style={s.divider} />
          <SettingsMenuItem icon={<BellIcon />} label="Notification Preferences" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<CardIcon />} label="Payment Methods" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<HelpIcon />} label="Help & Support" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<DocIcon />} label="Terms & Conditions" />
          <View style={s.divider} />
          <SettingsMenuItem icon={<PrivacyIcon />} label="Privacy Policy" />
        </View>

        <DangerZone />

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    position: "relative",
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
    paddingRight: 8,
    flexShrink: 0,
    position: "relative",
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
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  scroll: {
    flex: 1,
    zIndex: 5,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  settingsCard: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 58,
  },
});
