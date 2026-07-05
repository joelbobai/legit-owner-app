import { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect, Line } from "react-native-svg";

import { router } from "expo-router";
import { ChevronRightIcon, CopyIcon, FilterListIcon, GridIcon, PlusIcon, SearchIcon, SortArrowsIcon } from "@/components/Icon";
import { DotGrid } from "@/components/DotGrid";

const { width: SW } = Dimensions.get("window");

type DeviceStatus = "active" | "transferred" | "stolen";

type Device = {
  id: string;
  name: string;
  brand: string;
  os: string;
  storage: string;
  color: string;
  imei: string;
  status: DeviceStatus;
  registeredDate: string;
  iconBg: string;
  accentColor: string;
};

const DEVICES: Device[] = [
  {
    id: "1",
    name: "Samsung Galaxy A54",
    brand: "Samsung",
    os: "Android",
    storage: "128GB",
    color: "Black",
    imei: "35827*******",
    status: "active",
    registeredDate: "Jan 12, 2025",
    iconBg: "#F5F7FA",
    accentColor: "#1A56FF",
  },
  {
    id: "2",
    name: "iPhone 13 Pro",
    brand: "Apple",
    os: "iOS",
    storage: "256GB",
    color: "Sierra Blue",
    imei: "35291*******",
    status: "transferred",
    registeredDate: "Feb 3, 2025",
    iconBg: "#F5F7FA",
    accentColor: "#64748B",
  },
  {
    id: "3",
    name: "Tecno Camon 20",
    brand: "Tecno",
    os: "Android",
    storage: "128GB",
    color: "Dark Shade",
    imei: "86712*******",
    status: "active",
    registeredDate: "Mar 20, 2025",
    iconBg: "#F0FDF4",
    accentColor: "#16A34A",
  },
];

type Filter = "all" | "active" | "transferred" | "stolen";

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: "all", label: "All Devices", color: "#1A56FF" },
  { key: "active", label: "Active", color: "#16A34A" },
  { key: "transferred", label: "Transferred", color: "#64748B" },
  { key: "stolen", label: "Stolen", color: "#DC2626" },
];

const STATUS_CONFIG: Record<DeviceStatus, { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "#DCFCE7", text: "#16A34A" },
  transferred: { label: "Transferred", bg: "#F1F5F9", text: "#64748B" },
  stolen: { label: "Stolen", bg: "#FEF2F2", text: "#DC2626" },
};

function DeviceIcon({ accent }: { accent: string }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={accent} strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="18" r="1" fill={accent} />
    </Svg>
  );
}

function ModelIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Rect x="2" y="1" width="8" height="10" rx="1.5" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
      <Path d="M4 4H8M4 6H6" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function ImeiIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Rect x="1" y="2" width="10" height="8" rx="1" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
      <Path d="M4 4V8M6 4V8M8 4V8" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

function CalendarIconSm() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Rect x="1" y="2" width="12" height="10" rx="2" stroke="#CBD5E1" strokeWidth="1.2" fill="none" />
      <Path d="M1 5H13" stroke="#CBD5E1" strokeWidth="1.2" />
    </Svg>
  );
}

function ShieldIconSm({ color = "#1A56FF" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path d="M7 1L11 3.5V7.5C11 10 9 12 7 13C5 12 3 10 3 7.5V3.5Z" stroke={color} strokeWidth="1.3" fill="none" />
      <Path d="M5 7L6.5 8.5L9.5 5.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TransferIconSm({ color = "#64748B" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path d="M3 5L7 2L11 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11 9L7 12L3 9" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 2V12" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ color = "#16A34A" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.3" fill="none" />
      <Path d="M4.5 7L6 8.5L9.5 5.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function AlertShieldIconSm({ color = "#DC2626" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Path d="M7 1.5L11 4V8C11 10.5 9.2 12.2 7 13C4.8 12.2 3 10.5 3 8V4Z" stroke={color} strokeWidth="1.3" fill="none" />
      <Path d="M7 5.5V8.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Circle cx="7" cy="10" r="0.5" fill={color} />
    </Svg>
  );
}

type FilterPillIconProps = { filter: Filter; active: boolean };

function FilterPillIcon({ filter, active }: FilterPillIconProps) {
  const c = active ? "white" : "#94A3B8";
  if (filter === "all") return <GridIcon size={14} color={c} />;
  if (filter === "active") return <CheckIcon color={c} />;
  if (filter === "transferred") return <TransferIconSm color={c} />;
  return <AlertShieldIconSm color={c} />;
}

function EmptyStateIllustration() {
  return (
    <Svg width={180} height={160} viewBox="0 0 180 160" fill="none">
      <Rect x="30" y="50" width="120" height="90" rx="12" fill="#EEF3FF" />
      <Rect x="40" y="60" width="100" height="70" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <Circle cx="90" cy="88" r="16" fill="#EEF3FF" />
      <Path d="M84 88L88 92L96 83" stroke="#1A56FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="60" y="110" width="60" height="6" rx="3" fill="#E2E8F0" />
      <Rect x="70" y="120" width="40" height="4" rx="2" fill="#E2E8F0" />
      <Rect x="55" y="20" width="70" height="16" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
    </Svg>
  );
}

function FilterRow({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: Filter;
  onFilterChange: (f: Filter) => void;
}) {
  return (
    <View style={s.filterRow}>
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.key;
        return (
          <Pressable
            key={f.key}
            style={[s.filterPill, isActive ? s.filterPillActive : s.filterPillInactive]}
            onPress={() => onFilterChange(f.key)}
          >
            <FilterPillIcon filter={f.key} active={isActive} />
            <Text style={[s.filterPillText, isActive && { color: "white" }]}>
              {f.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DeviceCard({ device }: { device: Device }) {
  const statusCfg = STATUS_CONFIG[device.status];
  const isTransferred = device.status === "transferred";
  const footActionColor = isTransferred ? "#64748B" : "#1A56FF";
  const footActionLabel = isTransferred ? "Transfer Record" : "View Certificate";
  const FootIcon = isTransferred ? TransferIconSm : ShieldIconSm;

  return (
    <Pressable style={[s.deviceCard, isTransferred && s.deviceCardDim]} onPress={() => router.push(`/device/${device.id}` as any)}>
      <View style={s.dLeft}>
        <View style={[s.dIconBox, { backgroundColor: device.iconBg }]}>
          <DeviceIcon accent={device.accentColor} />
        </View>
        <View style={s.dBrandPill}>
          <Text style={s.dBrandPillText}>{device.brand}</Text>
        </View>
      </View>

      <View style={s.dBody}>
        <View style={s.dHead}>
          <Text style={s.dName} numberOfLines={1}>{device.name}</Text>
          <View style={[s.dStatus, { backgroundColor: statusCfg.bg }]}>
            <View style={[s.statusDot, { backgroundColor: statusCfg.text }]} />
            <Text style={[s.dStatusText, { color: statusCfg.text }]}>{statusCfg.label}</Text>
          </View>
        </View>

        <View style={s.dModel}>
          <ModelIcon />
          <Text style={s.dModelText}>{device.os} &middot; {device.storage} &middot; {device.color}</Text>
        </View>

        <View style={s.dImei}>
          <ImeiIcon />
          <Text style={s.dImeiText}>IMEI: {device.imei}</Text>
          <Pressable hitSlop={6}>
            <CopyIcon size={14} color="#1A56FF" />
          </Pressable>
        </View>

        <View style={s.dDivider} />

        <View style={s.dFoot}>
          <View style={s.dFootLeft}>
            <CalendarIconSm />
            <Text style={s.dFootLeftText}>Registered {device.registeredDate}</Text>
          </View>
          <Pressable style={s.dFootRight}>
            <FootIcon color={footActionColor} />
            <Text style={[s.dFootRightText, { color: footActionColor }]}>{footActionLabel}</Text>
          </Pressable>
        </View>
      </View>

      <ChevronRightIcon size={20} color="#CBD5E1" />
    </Pressable>
  );
}

export default function DevicesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = DEVICES.length;
    const active = DEVICES.filter((d) => d.status === "active").length;
    const transferred = DEVICES.filter((d) => d.status === "transferred").length;
    return { total, active, transferred };
  }, []);

  const filtered = useMemo(() => {
    let list = DEVICES;
    if (filter !== "all") list = list.filter((d) => d.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.brand.toLowerCase().includes(q) ||
          d.imei.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  const showEmpty = filtered.length === 0;

  return (
    <View style={s.screen}>
      <DotGrid id="dotsDevices" />
      <View style={s.blobTR} pointerEvents="none" />

      <View style={{ height: insets.top, backgroundColor: "white" }} />

      <View style={s.appBar}>
        <View>
          <Text style={s.barCaption}>YOUR DEVICES</Text>
          <Text style={s.barTitle}>My Devices</Text>
        </View>
        <Pressable style={s.barAdd} onPress={() => router.push("/(user)/register-device/step1" as any)}>
          <PlusIcon size={20} color="white" />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.searchRow}>
          <View style={s.searchWrap}>
            <SearchIcon size={20} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, IMEI or brand\u2026"
              placeholderTextColor="#CBD5E1"
              autoCapitalize="none"
              autoCorrect={false}
              nativeID="devices-search-input"
            />
            <FilterListIcon size={20} color="#1A56FF" />
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <View style={[s.statBar, { backgroundColor: "#1A56FF" }]} />
            <View>
              <Text style={[s.statNum, { color: "#0D0D0D" }]}>{stats.total}</Text>
              <Text style={s.statLbl}>Total</Text>
            </View>
          </View>
          <View style={s.statCard}>
            <View style={[s.statBar, { backgroundColor: "#16A34A" }]} />
            <View>
              <Text style={[s.statNum, { color: "#16A34A" }]}>{stats.active}</Text>
              <Text style={s.statLbl}>Active</Text>
            </View>
          </View>
          <View style={s.statCard}>
            <View style={[s.statBar, { backgroundColor: "#F59E0B" }]} />
            <View>
              <Text style={[s.statNum, { color: "#F59E0B" }]}>{stats.transferred}</Text>
              <Text style={s.statLbl}>Transferred</Text>
            </View>
          </View>
        </View>

        <FilterRow activeFilter={filter} onFilterChange={setFilter} />

        <View style={s.listHdr}>
          <Text style={s.listCount}>
            Showing {filtered.length} device{filtered.length !== 1 ? "s" : ""}
          </Text>
          <Pressable style={s.listSort}>
            <SortArrowsIcon size={16} color="#1A56FF" />
            <Text style={s.listSortText}>Sort</Text>
          </Pressable>
        </View>

        {showEmpty ? (
          <View style={s.emptyState}>
            <EmptyStateIllustration />
            <Text style={s.emptyTitle}>No devices yet</Text>
            <Text style={s.emptySub}>
              Register your first device to start protecting your ownership
            </Text>
            <Pressable style={s.emptyBtn} onPress={() => router.push("/(user)/register-device/step1" as any)}>
              <PlusIcon size={20} color="white" />
              <Text style={s.emptyBtnText}>Register My First Device</Text>
            </Pressable>
          </View>
        ) : (
          <View style={s.devicesList}>
            {filtered.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={s.fab}>
        <View style={s.fabLabel}>
          <Text style={s.fabLabelText}>Register Device</Text>
        </View>
        <Pressable style={s.fabBtn} onPress={() => router.push("/(user)/register-device/step1" as any)}>
          <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
            <Path d="M14 6V22M6 14H22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>
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
  scrollContent: { paddingBottom: 24 },

  appBar: {
    height: 72, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#F1F5F9",
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, position: "relative", zIndex: 10,
  },
  barCaption: { fontSize: 11, fontWeight: "600", color: "#94A3B8", letterSpacing: 2 },
  barTitle: { fontSize: 24, fontWeight: "700", color: "#0D0D0D", marginTop: 2 },
  barAdd: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#1A56FF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#1A56FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },

  searchRow: { paddingHorizontal: 20, marginTop: 12 },
  searchWrap: {
    width: "100%", height: 52, borderRadius: 14,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0",
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: "#0D0D0D",
    paddingHorizontal: 10, paddingVertical: 0,
    height: 52,
  },

  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 12 },
  statCard: {
    flex: 1, backgroundColor: "white", borderRadius: 12,
    padding: 14, flexDirection: "row", gap: 10, alignItems: "center", overflow: "hidden",
  },
  statBar: { width: 3, height: 36, borderRadius: 100 },
  statNum: { fontSize: 22, fontWeight: "900", lineHeight: 22 },
  statLbl: { fontSize: 12, color: "#94A3B8", marginTop: 2 },

  filterRow: {
    flexDirection: "row", gap: 8, paddingHorizontal: 20, marginTop: 14,
    overflow: "scroll", flexWrap: "nowrap",
  },
  filterPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 100,
  },
  filterPillActive: { backgroundColor: "#1A56FF" },
  filterPillInactive: { backgroundColor: "white", borderWidth: 1.5, borderColor: "#E2E8F0" },
  filterPillText: { fontSize: 13, fontWeight: "600", color: "#4A4A4A" },

  listHdr: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 20, marginTop: 16, marginBottom: 12,
  },
  listCount: { fontSize: 13, color: "#94A3B8" },
  listSort: { flexDirection: "row", alignItems: "center", gap: 4 },
  listSortText: { fontSize: 13, fontWeight: "600", color: "#1A56FF" },

  devicesList: { paddingHorizontal: 20 },

  deviceCard: {
    backgroundColor: "white", borderRadius: 20, padding: 16,
    flexDirection: "row", gap: 14, position: "relative", alignItems: "center",
  },
  deviceCardDim: { opacity: 0.98 },
  dLeft: { alignItems: "center", gap: 6, flexShrink: 0 },
  dIconBox: {
    width: 64, height: 64, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  dBrandPill: {
    paddingVertical: 2, paddingHorizontal: 8, borderRadius: 100,
    backgroundColor: "white", borderWidth: 1, borderColor: "#E2E8F0",
  },
  dBrandPillText: { fontSize: 10, fontWeight: "600", color: "#4A4A4A" },
  dBody: { flex: 1, minWidth: 0 },
  dHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  dName: { fontSize: 16, fontWeight: "700", color: "#0D0D0D", flex: 1, marginRight: 8 },
  dStatus: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 100,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  dStatusText: { fontSize: 11, fontWeight: "600" },
  dModel: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  dModelText: { fontSize: 13, color: "#94A3B8" },
  dImei: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  dImeiText: { fontSize: 12, color: "#94A3B8" },
  dDivider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 12 },
  dFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dFootLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  dFootLeftText: { fontSize: 11, color: "#94A3B8" },
  dFootRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  dFootRightText: { fontSize: 11, fontWeight: "600" },

  emptyState: { alignItems: "center", paddingHorizontal: 20, paddingTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#0D0D0D", marginTop: 24 },
  emptySub: { fontSize: 14, color: "#4A4A4A", textAlign: "center", maxWidth: 280, lineHeight: 21, marginTop: 8 },
  emptyBtn: {
    marginTop: 24, width: "100%", maxWidth: 320, height: 56, borderRadius: 14,
    backgroundColor: "#1A56FF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
  },
  emptyBtnText: { fontSize: 16, fontWeight: "600", color: "white" },

  fab: {
    position: "absolute", bottom: 24, right: 20, zIndex: 20,
    flexDirection: "row", alignItems: "center", gap: 10,
  },
  fabLabel: {
    backgroundColor: "white", borderRadius: 100, paddingVertical: 6, paddingHorizontal: 14,
  },
  fabLabelText: { fontSize: 13, fontWeight: "600", color: "#0D0D0D" },
  fabBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#1A56FF",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#1A56FF", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
  },
});
