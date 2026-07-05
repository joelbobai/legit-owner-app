import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

function CheckSmallIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

type Props = {
  step: number;
};

function StepIndicator({ step }: Props) {
  return (
    <View style={s.wrap}>
      {/* Step 1 */}
      <View style={s.step}>
        <View style={[s.circle, step >= 1 ? s.circleActive : s.circleInactive, step >= 1 && s.circleShadow]}>
          {step > 1 ? <CheckSmallIcon /> : <Text style={s.circleText}>1</Text>}
        </View>
        <Text style={[s.label, step >= 1 && s.labelActive]}>Select Device</Text>
      </View>

      {/* Connector */}
      <View style={s.connectorTrack}>
        <View style={[s.connectorFill, { width: step >= 2 ? "100%" : "50%" }]} />
      </View>

      {/* Step 2 */}
      <View style={s.step}>
        <View style={[s.circle, step >= 2 ? s.circleActive : s.circleBorder, step >= 2 && s.circleShadow]}>
          <Text style={[s.circleText, s.circleTextNum, { color: step >= 2 ? "white" : "#94A3B8" }]}>2</Text>
        </View>
        <Text style={[s.label, step >= 2 && s.labelActive]}>Buyer Details</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    backgroundColor: "#1A56FF",
  },
  circleInactive: {
    backgroundColor: "#E2E8F0",
  },
  circleBorder: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  circleShadow: {
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  circleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
  },
  circleTextNum: {
    fontSize: 13,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  labelActive: {
    color: "#1A56FF",
  },
  connectorTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
    marginBottom: 20,
    borderRadius: 2,
    position: "relative",
    overflow: "hidden",
  },
  connectorFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#1A56FF",
    borderRadius: 2,
  },
});

export default memo(StepIndicator);
