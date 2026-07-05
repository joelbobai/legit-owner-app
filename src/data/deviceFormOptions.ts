export const OS_OPTIONS = [
  { label: "iOS", value: "iOS" },
  { label: "Android", value: "Android" },
  { label: "Windows", value: "Windows" },
  { label: "macOS", value: "macOS" },
  { label: "Linux", value: "Linux" },
  { label: "HarmonyOS", value: "HarmonyOS" },
  { label: "Other", value: "Other" },
];

export const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];

export const COLOR_OPTIONS = [
  { name: "Black", color: "#0D0D0D" },
  { name: "White", color: "#FFFFFF" },
  { name: "Blue", color: "#2563EB" },
  { name: "Green", color: "#16A34A" },
  { name: "Red", color: "#DC2626" },
  { name: "Purple", color: "#9333EA" },
  { name: "Gold", color: "#F59E0B" },
  { name: "Silver", color: "#94A3B8" },
];

export const CONDITION_OPTIONS = [
  { label: "New", value: "new" },
  { label: "Used — Good", value: "good" },
  { label: "Used — Fair", value: "fair" },
];

export const CONDITION_COLORS: Record<string, string> = {
  new: "#16A34A",
  good: "#1A56FF",
  fair: "#F59E0B",
};

export const CONDITION_BG_COLORS: Record<string, string> = {
  new: "#F0FDF4",
  good: "#EEF3FF",
  fair: "#FFFBEB",
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const monthIndex = parseInt(m, 10) - 1;
  return `${MONTHS[monthIndex]} ${parseInt(d, 10)}, ${y}`;
}
