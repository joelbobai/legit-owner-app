export type DeviceCategory = {
  id: string;
  label: string;
};

export const DEVICE_CATEGORIES: DeviceCategory[] = [
  { id: "smartphone", label: "Smartphone" },
  { id: "laptop", label: "Laptop" },
  { id: "tablet", label: "Tablet" },
  { id: "smartwatch", label: "Smartwatch" },
  { id: "gaming", label: "Gaming Console" },
  { id: "camera", label: "Camera" },
  { id: "desktop", label: "Desktop PC" },
  { id: "other", label: "Other" },
];
