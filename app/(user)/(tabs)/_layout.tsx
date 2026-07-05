import { Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? "#1A56FF" : "#94A3B8";
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H15V16H9V21H4C3.4 21 3 20.6 3 20V10Z" stroke={c} strokeWidth="2" fill="none" />
    </Svg>
  );
}

function DevicesIcon({ active }: { active: boolean }) {
  const c = active ? "#1A56FF" : "#94A3B8";
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="2" width="12" height="20" rx="3" stroke={c} strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="18" r="1.2" fill={c} />
    </Svg>
  );
}

function TrackIcon({ active }: { active: boolean }) {
  const c = active ? "#1A56FF" : "#94A3B8";
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.7 2 6 4.7 6 8C6 13 12 22 12 22C12 22 18 13 18 8C18 4.7 15.3 2 12 2Z" stroke={c} strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="8" r="2.5" stroke={c} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function AlertsIcon({ active }: { active: boolean }) {
  const c = active ? "#1A56FF" : "#94A3B8";
  return (
    <View style={{ position: "relative" }}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M12 3C8.7 3 6 5.7 6 9V14L4 16H20L18 14V9C18 5.7 15.3 3 12 3Z" stroke={c} strokeWidth="1.7" fill="none" />
        <Path d="M10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16" stroke={c} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      </Svg>
      <View style={tabStyles.badge}>
        <Text style={tabStyles.badgeText}>3</Text>
      </View>
    </View>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? "#1A56FF" : "#94A3B8";
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" fill="none" />
      <Circle cx="12" cy="10" r="3.5" stroke={c} strokeWidth="1.5" fill="none" />
      <Path d="M5 19C5 16.2 8.1 14 12 14C15.9 14 19 16.2 19 19" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

const TAB_CONFIG = [
  { name: "index", label: "Home", Icon: HomeIcon },
  { name: "devices", label: "Devices", Icon: DevicesIcon },
  { name: "track", label: "Track", Icon: TrackIcon },
  { name: "alerts", label: "Alerts", Icon: AlertsIcon },
  { name: "profile", label: "Profile", Icon: ProfileIcon },
];

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[tabStyles.bar, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route: any, index: number) => {
        const isActive = state.index === index;
        const tab = TAB_CONFIG.find(t => t.name === route.name) ?? TAB_CONFIG[0];
        return (
          <Pressable
            key={route.key}
            style={tabStyles.item}
            onPress={() => { if (!isActive) navigation.navigate(route.name); }}
          >
            <tab.Icon active={isActive} />
            <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={tabStyles.dot} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    paddingTop: 10,
  },
  item: { flex: 1, alignItems: "center", gap: 3 },
  label: { fontSize: 10, color: "#94A3B8" },
  labelActive: { color: "#1A56FF", fontWeight: "600" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#1A56FF" },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DC2626",
    borderWidth: 1.5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 7, fontWeight: "700", color: "white" },
});

export default function UserTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="devices" />
      <Tabs.Screen name="track" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
