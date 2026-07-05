import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export type FilterId = "all" | "devices" | "transfers" | "alerts";

type PillDef = {
  id: FilterId;
  label: string;
};

const PILLS: PillDef[] = [
  { id: "all", label: "All" },
  { id: "devices", label: "Devices" },
  { id: "transfers", label: "Transfers" },
  { id: "alerts", label: "Alerts" },
];

type Props = {
  active: FilterId;
  counts: Record<FilterId, number>;
  onSelect: (id: FilterId) => void;
};

function FilterPills({ active, counts, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scroll}
      style={s.outer}
    >
      {PILLS.map((p) => {
        const selected = active === p.id;
        const count = counts[p.id] ?? 0;
        return (
          <View key={p.id}>
            {/* The pill */}
            {selected ? (
              <LinearGradient
                colors={["#1A56FF", "#0A2ECC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.pill}
              >
                <Text style={s.pillTextActive}>{p.label}</Text>
                {count > 0 && (
                  <View style={s.countBadgeActive}>
                    <Text style={s.countTextActive}>{count}</Text>
                  </View>
                )}
              </LinearGradient>
            ) : (
              <View style={s.pillInactive}>
                <Text style={s.pillTextInactive}>{p.label}</Text>
                {count > 0 && (
                  <View style={s.countBadgeInactive}>
                    <Text style={s.countTextInactive}>{count}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  outer: {
    maxHeight: 40,
  },
  scroll: {
    gap: 8,
    paddingHorizontal: 20,
  },
  pill: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  pillInactive: {
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillTextActive: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
  },
  pillTextInactive: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  countBadgeActive: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeInactive: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  countTextActive: {
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    fontVariant: ["tabular-nums"],
  },
  countTextInactive: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1A56FF",
    fontVariant: ["tabular-nums"],
  },
});

export default memo(FilterPills);
