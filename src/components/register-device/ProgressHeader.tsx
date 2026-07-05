import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const STEPS = ["Category", "Details", "Verify", "Confirm"];

type Props = {
  current: number;
  total: number;
};

function Checkmark() {
  return (
    <Svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <Path d="M2 5L4.3 7.3L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ProgressHeader({ current, total }: Props) {
  const pct = (current / total) * 100;

  return (
    <View style={s.container}>
      <View style={s.stepsRow}>
        {Array.from({ length: total }).map((_, i) => {
          const stepNum = i + 1;
          const done = stepNum < current;
          const active = stepNum === current;

          return (
            <View key={i} style={s.stepItem}>
              <View
                style={[
                  s.stepCircle,
                  done && s.stepCircleDone,
                  active && s.stepCircleActive,
                ]}
              >
                {done ? (
                  <Checkmark />
                ) : (
                  <Text style={[s.stepNum, active && s.stepNumActive]}>
                    {stepNum}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={s.trackOuter}>
        <View style={s.track}>
          <LinearGradient
            colors={["#1A56FF", "#0A2ECC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.fill, { width: `${pct}%` as any }]}
          />
          <View style={s.fillShine} />
        </View>
      </View>

      <View style={s.labelsRow}>
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActiveOrDone = stepNum <= current;
          return (
            <Text
              key={i}
              style={[
                s.stepLabel,
                isActiveOrDone && s.stepLabelActive,
              ]}
            >
              {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 16 },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleDone: {
    backgroundColor: "#1A56FF",
  },
  stepCircleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1A56FF",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  stepNum: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  stepNumActive: {
    color: "white",
    fontSize: 12,
  },
  trackOuter: { height: 6 },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
    position: "absolute",
    left: 0,
    top: 0,
  },
  fillShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 3,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: "400",
    color: "#CBD5E1",
    letterSpacing: 0.3,
  },
  stepLabelActive: {
    fontWeight: "700",
    color: "#1A56FF",
  },
});

export default memo(ProgressHeader);
