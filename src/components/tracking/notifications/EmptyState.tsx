import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

function EmptyIllustration() {
  return (
    <Svg width={160} height={160} viewBox="0 0 160 160" fill="none">
      <Path
        d="M80 20L36 32V72C36 102 56 128 80 138C104 128 124 102 124 72V32L80 20Z"
        fill="#EEF3FF"
        stroke="#93C5FD"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M80 56C66 56 58 66 58 80V94L52 100H108L102 94V80C102 66 94 56 80 56Z"
        fill="white"
        stroke="#1A56FF"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Circle cx={80} cy={52} r={3.5} fill="#1A56FF" />
      <Path
        d="M72 108C72 112 75.5 116 80 116C84.5 116 88 112 88 108"
        stroke="#1A56FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={80} cy={82} r={14} fill="#1A56FF" />
      <Path
        d="M72 82L78 88L88 76"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={40} cy={50} r={2} fill="#1A56FF" opacity={0.5} />
      <Circle cx={120} cy={46} r={2.5} fill="#1A56FF" opacity={0.4} />
      <Circle cx={128} cy={92} r={2} fill="#1A56FF" opacity={0.4} />
      <Circle cx={32} cy={96} r={2.5} fill="#1A56FF" opacity={0.5} />
    </Svg>
  );
}

function EmptyState() {
  return (
    <View style={s.wrap}>
      <EmptyIllustration />
      <Text style={s.title}>All caught up!</Text>
      <Text style={s.subtitle}>No new notifications right now</Text>
      <Text style={s.footer}>Check back later</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D0D0D",
    letterSpacing: -0.3,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#4A4A4A",
    textAlign: "center",
    lineHeight: 21,
  },
  footer: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
});

export default memo(EmptyState);
