export type DeviceStatus = "active" | "transferred" | "stolen";

export type Device = {
  id: string;
  name: string;
  brand: string;
  category: string;
  os: string;
  storage: string;
  color: string;
  imei: string;
  serialNumber: string;
  status: DeviceStatus;
  registeredDate: string;
  purchaseDate: string;
  condition: string;
  ownerName: string;
  iconBg: string;
  accentColor: string;
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
  };
  lastSeen?: string;
};

export type StatusConfig = {
  label: string;
  bg: string;
  text: string;
  dot: string;
};
