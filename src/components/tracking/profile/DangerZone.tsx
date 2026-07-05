import { memo, useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

function LogoutIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M15 4H5C3.9 4 3 4.9 3 6V18C3 19.1 3.9 20 5 20H15" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Path d="M10 12H21M21 12L17 8M21 12L17 16" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H5H21" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Path d="M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V6H19Z" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M10 11V17M14 11V17" stroke="#DC2626" strokeWidth="1.7" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function ChevronDownIcon({ color = "#DC2626" }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 16 16" fill="none">
      <Path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DangerZone() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const contentHeight = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  const toggleDelete = useCallback(() => {
    if (deleteOpen) {
      contentHeight.value = withTiming(0, { duration: 200 });
      contentOpacity.value = withTiming(0, { duration: 150 });
    } else {
      contentHeight.value = withTiming(100, { duration: 250 });
      contentOpacity.value = withTiming(1, { duration: 200 });
    }
    setDeleteOpen((v) => !v);
  }, [deleteOpen, contentHeight, contentOpacity]);

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: contentHeight.value,
    opacity: contentOpacity.value,
    overflow: "hidden",
  }));

  return (
    <View style={s.wrap}>
      {/* Logout */}
      <View style={s.menuItem}>
        <View style={s.iconWrap}>
          <LogoutIcon />
        </View>
        <Text style={s.label}>Logout</Text>
        <View style={s.chevronWrap}>
          <ChevronDownIcon />
        </View>
      </View>

      {/* Delete Account */}
      <Pressable onPress={toggleDelete} style={s.menuItem}>
        <View style={s.iconWrap}>
          <TrashIcon />
        </View>
        <Text style={s.label}>Delete Account</Text>
        <ChevronDownIcon />
      </Pressable>

      <Animated.View style={contentStyle}>
        <View style={s.deleteContent}>
          <Text style={s.warningText}>
            This action cannot be undone. All your data, devices and certificates will be permanently removed.
          </Text>
          <Pressable style={s.confirmBtn}>
            <Text style={s.confirmText}>Confirm Delete</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 8,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    height: 56,
    paddingHorizontal: 20,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  chevronWrap: {
    marginLeft: "auto",
  },
  deleteContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  warningText: {
    fontSize: 11,
    color: "#DC2626",
    lineHeight: 16,
  },
  confirmBtn: {
    height: 36,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  confirmText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(DangerZone);
