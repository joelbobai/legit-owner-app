import EmptyState from "@/components/tracking/notifications/EmptyState";
import type { FilterId } from "@/components/tracking/notifications/FilterPills";
import FilterPills from "@/components/tracking/notifications/FilterPills";
import type { NotificationItem } from "@/components/tracking/notifications/NotificationCard";
import NotificationCard from "@/components/tracking/notifications/NotificationCard";
import NotificationSectionHeader from "@/components/tracking/notifications/NotificationSectionHeader";
import RefreshIndicator from "@/components/tracking/notifications/RefreshIndicator";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

function ArrowLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M5 12L11 18M5 12L11 6"
        stroke="#0D0D0D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    kind: "transfer",
    section: "today",
    cat: "transfers",
    unread: true,
    title: "New transfer request",
    subtitle:
      "Adaeze Okoro wants to receive ownership of your Samsung Galaxy A54.",
    time: "2m ago",
  },
  {
    id: 2,
    kind: "alert",
    section: "today",
    cat: "alerts",
    unread: true,
    title: "Device went offline unexpectedly",
    subtitle: "Tecno Camon 20 last seen 14 min ago near Yaba. Tap to track.",
    time: "18m ago",
  },
  {
    id: 3,
    kind: "info",
    section: "today",
    cat: "devices",
    unread: true,
    title: "Someone verified your Tecno Camon 20",
    subtitle: "Verification request from a buyer in Lagos. No data shared.",
    time: "1h ago",
  },
  {
    id: 4,
    kind: "success",
    section: "today",
    cat: "devices",
    unread: false,
    title: "Registration successful",
    subtitle: "Samsung Galaxy A54 · IMEI: 35827******",
    time: "3h ago",
  },
  {
    id: 5,
    kind: "transfer",
    section: "earlier",
    cat: "transfers",
    unread: false,
    title: "Transfer completed",
    subtitle: "Ownership of iPhone 13 Pro transferred to Chukwuemeka Okoro.",
    time: "Yesterday",
  },
  {
    id: 6,
    kind: "info",
    section: "earlier",
    cat: "devices",
    unread: false,
    title: "New certificate available",
    subtitle: "Your ownership certificate for Pixel 7 was reissued.",
    time: "2d ago",
  },
  {
    id: 7,
    kind: "success",
    section: "earlier",
    cat: "devices",
    unread: false,
    title: "Login from new device",
    subtitle: "iPhone 14 Pro · Lagos, Nigeria · Recognized as you.",
    time: "4d ago",
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<FilterId>("all");
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const [showEmpty, setShowEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const counts = useMemo(
    () => ({
      all: items.filter((i) => i.unread).length,
      devices: items.filter((i) => i.unread && i.cat === "devices").length,
      transfers: items.filter((i) => i.unread && i.cat === "transfers").length,
      alerts: items.filter((i) => i.unread && i.cat === "alerts").length,
    }),
    [items],
  );

  const visible = useMemo(
    () =>
      showEmpty
        ? []
        : items.filter((i) => filter === "all" || i.cat === filter),
    [items, filter, showEmpty],
  );

  const today = useMemo(
    () => visible.filter((i) => i.section === "today"),
    [visible],
  );
  const earlier = useMemo(
    () => visible.filter((i) => i.section === "earlier"),
    [visible],
  );

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
  }, []);

  const markOne = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, unread: false } : i)),
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1100);
  }, []);

  const handleBack = useCallback(() => {
    // no-op for tab
  }, []);

  return (
    <View style={s.screen}>
      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.topBar}>
        <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={s.topBarTitle}>Notifications</Text>
        {counts.all > 0 ? (
          <Pressable onPress={markAllRead} style={s.markAllBtn} hitSlop={8}>
            <Text style={s.markAllText}>Mark all read</Text>
          </Pressable>
        ) : (
          <View style={s.topBarSpacer} />
        )}
      </View>

      <View style={s.filterWrap}>
        <FilterPills active={filter} counts={counts} onSelect={setFilter} />
        <View style={s.filterBottomSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {refreshing && <RefreshIndicator />}

        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {today.length > 0 && (
              <>
                <NotificationSectionHeader label="TODAY" />
                <View style={s.cardGroup}>
                  {today.map((n) => (
                    <NotificationCard
                      key={n.id}
                      item={n}
                      onPress={() => markOne(n.id)}
                    />
                  ))}
                </View>
              </>
            )}
            {earlier.length > 0 && (
              <>
                {today.length > 0 && <View style={{ height: 8 }} />}
                <NotificationSectionHeader label="EARLIER" />
                <View style={s.cardGroup}>
                  {earlier.map((n) => (
                    <NotificationCard
                      key={n.id}
                      item={n}
                      onPress={() => {
                        markOne(n.id);
                        router.push("/(user)/transfer-buyer" as any);
                      }}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {/* Demo controls */}
        <View style={s.demoControls}>
          <Pressable onPress={handleRefresh} style={s.demoBtn}>
            <Text style={s.demoBtnIcon}>↻</Text>
            <Text style={s.demoBtnText}>Pull to refresh</Text>
          </Pressable>
          <Pressable onPress={() => setShowEmpty((v) => !v)} style={s.demoBtn}>
            <Text style={s.demoBtnText}>
              {showEmpty ? "Show notifications" : "Preview empty state"}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
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
    paddingRight: 16,
    flexShrink: 0,
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
  markAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A56FF",
  },
  topBarSpacer: {
    width: 44,
  },
  filterWrap: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  filterBottomSpacer: {
    height: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 0,
    paddingBottom: 20,
  },
  cardGroup: {
    gap: 12,
  },
  demoControls: {
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  demoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 100,
  },
  demoBtnIcon: {
    fontSize: 12,
    color: "#1A56FF",
    fontWeight: "600",
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
});
