import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

function CheckIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CloseIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d="M6 6L18 18M18 6L6 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  onAccept: () => void;
  onReject: () => void;
  acceptLoading?: boolean;
  rejectLoading?: boolean;
};

function ActionButtons({ onAccept, onReject, acceptLoading, rejectLoading }: Props) {
  const acceptScale = useSharedValue(1);
  const rejectScale = useSharedValue(1);

  const acceptBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: acceptScale.value }],
  }));

  const rejectBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rejectScale.value }],
  }));

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.btnWrap, acceptBtnStyle]}>
        <Pressable
          onPress={onAccept}
          disabled={acceptLoading}
          onPressIn={() => { acceptScale.value = withSpring(0.95); }}
          onPressOut={() => { acceptScale.value = withSpring(1); }}
          style={[s.btn, s.acceptBtn]}
        >
          <CheckIcon />
          <Text style={s.acceptText}>{acceptLoading ? "Accepting..." : "Accept Transfer"}</Text>
        </Pressable>
      </Animated.View>

      <Animated.View style={[s.btnWrap, rejectBtnStyle]}>
        <Pressable
          onPress={onReject}
          disabled={rejectLoading}
          onPressIn={() => { rejectScale.value = withSpring(0.95); }}
          onPressOut={() => { rejectScale.value = withSpring(1); }}
          style={[s.btn, s.rejectBtn]}
        >
          <CloseIcon />
          <Text style={s.rejectText}>{rejectLoading ? "Rejecting..." : "Reject Transfer"}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 10,
  },
  btnWrap: {
    flex: 1,
  },
  btn: {
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  acceptBtn: {
    backgroundColor: "#16A34A",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  rejectBtn: {
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 6,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  rejectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default memo(ActionButtons);
