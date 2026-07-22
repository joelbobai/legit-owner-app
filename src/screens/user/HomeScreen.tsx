import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Path, Pattern, Rect } from "react-native-svg";
import axios from "axios";

import { AddCircleIcon, AlertShieldIcon, ArrowRightIcon, CheckCircleIcon, EyeIcon, LocationPinIcon, ScanFrameIcon, SmartphoneIcon, TransferIcon } from "@/components/Icon";
import { DotGrid } from "@/components/DotGrid";
import { ActionCard } from "@/components/home/ActionCard";
import { ActivityCard } from "@/components/home/ActivityCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { SectionRowHeader } from "@/components/home/SectionRowHeader";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/constants/api";

const { width: SW } = Dimensions.get("window");

// ─── Hero card (screen-specific) ─────────────────────────────────────────────

function HeroCard({ count }: { count: number }) {
  const W = SW - 40;
  return (
    <Pressable style={s.heroCard}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={W} height={160}>
          <Defs>
            <Pattern id="heroDots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <Circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.4)" />
            </Pattern>
          </Defs>
          <Rect width={W} height={160} fill="url(#heroDots)" opacity={0.04} />
        </Svg>
      </View>

      <View style={s.heroCircleTR} pointerEvents="none" />
      <View style={s.heroCircleBL} pointerEvents="none" />

      <View style={s.heroShieldWrap} pointerEvents="none">
        <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
          <Path d="M40 8L64 18V40C64 56 53 68 40 74C27 68 16 56 16 40V18Z" fill="white" fillOpacity={0.15} />
          <Path d="M40 14L60 23V40C60 53.5 51 63.5 40 69C29 63.5 20 53.5 20 40V23Z" fill="white" fillOpacity={0.1} />
          <Path d="M26 40L35 49L54 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <View style={s.activeBadge}>
          <Text style={s.activeBadgeText}>✓ Active</Text>
        </View>
        <View style={s.verifiedBadge}>
          <Text style={s.verifiedBadgeText}>🔒 Verified</Text>
        </View>
      </View>

      <View style={s.heroLeft}>
        <View>
          <View style={s.protectedPill}>
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path d="M6 1L10 3V6C10 8.5 8.2 10.5 6 11.5C3.8 10.5 2 8.5 2 6V3Z" fill="white" opacity={0.9} />
              <Path d="M4 6L5.5 7.5L8.5 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={s.protectedPillText}>Protected</Text>
          </View>
          <Text style={s.heroCount}>{count} Device{count !== 1 ? "s" : ""}</Text>
          <Text style={s.heroSub}>actively protected</Text>
          <View style={s.heroSeal}>
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path d="M8 1.5L10 4H13L11.5 6.5L13 9H10L8 11.5L6 9H3L4.5 6.5L3 4H6Z" stroke="#A5F3A5" strokeWidth="1.2" strokeLinejoin="round" />
              <Path d="M5.5 6.5L7 8L10.5 4.5" stroke="#A5F3A5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={s.heroSealText}>All verified & secure</Text>
          </View>
        </View>
        <View style={s.heroFooter}>
          <Text style={s.heroTap}>Tap to view all devices →</Text>
          <Svg width={16} height={16} viewBox="0 0 20 20" fill="none">
            <Path d="M5 10H15M15 10L9 4M15 10L9 16" stroke="rgba(255,255,255,0.70)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();
  const [deviceCount, setDeviceCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/device`, {
          params: { status: "all" },
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeviceCount(res.data.devices?.length || 0);
      } catch {
        setDeviceCount(0);
      }
    })();
  }, [token]);

  return (
    <View style={s.screen}>
      <DotGrid id="dotsHome" />
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />
      <HomeHeader name={user?.fullName?.split(" ")[0]} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard count={deviceCount} />

        <View style={s.sectionWrap}>
          <SectionRowHeader title="Quick Actions" linkText="See all" />
          <View style={s.actionsGrid}>
            <ActionCard
              iconBg="#EEF3FF"
              label="Register Device"
              caption="Add new device"
              icon={<AddCircleIcon size={24} color="#1A56FF" />}
            />
            <ActionCard
              iconBg="#F0FDF4"
              label="My Devices"
              caption={`View all ${deviceCount} device${deviceCount !== 1 ? "s" : ""}`}
              icon={<SmartphoneIcon size={24} color="#16A34A" />}
            />
            <ActionCard
              iconBg="#FFFBEB"
              label="Track Device"
              caption="Live location"
              icon={<LocationPinIcon size={24} color="#F59E0B" />}
            />
            <ActionCard
              iconBg="#FFF1F2"
              label="Report Stolen"
              caption="Emergency report"
              icon={<AlertShieldIcon size={24} color="#DC2626" />}
            />
          </View>
        </View>

        <Pressable style={s.verifyBanner}>
          <View style={s.bannerAccent} />
          <View style={s.bannerIcon}>
            <ScanFrameIcon size={32} color="#1A56FF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>Verify Before You Buy</Text>
            <Text style={s.bannerSub}>Check any device's ownership status for free</Text>
          </View>
          <View style={{ paddingRight: 16 }}>
            <ArrowRightIcon size={20} color="#1A56FF" />
          </View>
        </Pressable>

        <View style={s.sectionWrap}>
          <SectionRowHeader title="Recent Activity" linkText="View all" />
          <View style={{ gap: 10 }}>
            <ActivityCard
              iconBg="#F0FDF4"
              name="Samsung Galaxy A54 Registered"
              sub="IMEI: 35827******* · Active"
              time="Today, 9:41AM"
              pill="Active"
              pillVariant="green"
              icon={<CheckCircleIcon size={22} color="#16A34A" />}
            />
            <ActivityCard
              iconBg="#EEF3FF"
              name="Ownership Transfer Completed"
              sub="iPhone 13 Pro · Transferred to Adaeze"
              time="Yesterday"
              pill="Transferred"
              pillVariant="gray"
              icon={<TransferIcon size={22} color="#1A56FF" />}
            />
            <ActivityCard
              iconBg="#FFFBEB"
              name="Device Verification Attempt"
              sub="Someone verified your Tecno Camon 20"
              time="2 days ago"
              pill="Info"
              pillVariant="yellow"
              icon={<EyeIcon size={22} color="#F59E0B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F7FA" },
  blobTR: {
    position: "absolute", top: -30, right: -30,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "#EEF3FF", opacity: 0.4,
  },
  scrollContent: { padding: 20, paddingBottom: 24 },
  sectionWrap: { marginTop: 20 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },

  heroCard: {
    height: 180, borderRadius: 24, backgroundColor: "#1A56FF",
    overflow: "hidden", padding: 20, paddingBottom: 16, position: "relative",
  },
  heroCircleTR: {
    position: "absolute", top: -50, right: -50, width: 200, height: 200,
    borderRadius: 100, backgroundColor: "rgba(255,255,255,0.05)",
  },
  heroCircleBL: {
    position: "absolute", bottom: -30, left: -20, width: 120, height: 120,
    borderRadius: 60, backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroShieldWrap: { position: "absolute", right: 16, top: 40, width: 100, height: 80 },
  activeBadge: {
    position: "absolute", top: 4, right: 0,
    backgroundColor: "white", borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  activeBadgeText: { fontSize: 10, fontWeight: "600", color: "#16A34A" },
  verifiedBadge: {
    position: "absolute", bottom: 10, left: 0,
    backgroundColor: "white", borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  verifiedBadgeText: { fontSize: 10, fontWeight: "600", color: "#1A56FF" },
  heroLeft: { flex: 1, marginRight: 100, justifyContent: "space-between" },
  protectedPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100,
    paddingVertical: 4, paddingHorizontal: 12, alignSelf: "flex-start", marginBottom: 8,
  },
  protectedPillText: { fontSize: 12, fontWeight: "600", color: "white" },
  heroCount: { fontSize: 32, fontWeight: "900", color: "white", lineHeight: 36 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4 },
  heroSeal: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  heroSealText: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  heroFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroTap: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.70)" },

  verifyBanner: {
    marginTop: 16, borderRadius: 16, height: 72, backgroundColor: "#F0F7FF",
    flexDirection: "row", alignItems: "center", overflow: "hidden",
  },
  bannerAccent: { width: 4, height: 72, backgroundColor: "#1A56FF" },
  bannerIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#EEF3FF",
    alignItems: "center", justifyContent: "center", marginHorizontal: 12,
  },
  bannerTitle: { fontSize: 14, fontWeight: "600", color: "#0D0D0D" },
  bannerSub: { fontSize: 12, color: "#4A4A4A", marginTop: 2 },
});
