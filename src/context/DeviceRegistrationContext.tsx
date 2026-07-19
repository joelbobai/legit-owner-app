import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DeviceRegistrationData = {
  category: string;
  imei: string;
  imei2: string;
  name: string;
  brand: string;
  model: string;
  os: string;
  storage: string;
  color: string;
  serialNumber: string;
  purchaseDate: string;
  condition: string;
  notes: string;
};

const INITIAL_DATA: DeviceRegistrationData = {
  category: "",
  imei: "",
  imei2: "",
  name: "",
  brand: "",
  model: "",
  os: "",
  storage: "",
  color: "",
  serialNumber: "",
  purchaseDate: "",
  condition: "",
  notes: "",
};

type ContextType = {
  data: DeviceRegistrationData;
  setCategory: (v: string) => void;
  setImei: (v: string) => void;
  setImei2: (v: string) => void;
  updateDetails: (partial: Partial<DeviceRegistrationData>) => void;
  reset: () => void;
};

const DeviceRegistrationContext = createContext<ContextType | null>(null);

export function DeviceRegistrationProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DeviceRegistrationData>(INITIAL_DATA);

  const setCategory = useCallback((v: string) => setData((d) => ({ ...d, category: v })), []);
  const setImei = useCallback((v: string) => setData((d) => ({ ...d, imei: v })), []);
  const setImei2 = useCallback((v: string) => setData((d) => ({ ...d, imei2: v })), []);
  const updateDetails = useCallback((partial: Partial<DeviceRegistrationData>) => {
    setData((d) => ({ ...d, ...partial }));
  }, []);
  const reset = useCallback(() => setData(INITIAL_DATA), []);

  return (
    <DeviceRegistrationContext.Provider value={{ data, setCategory, setImei, setImei2, updateDetails, reset }}>
      {children}
    </DeviceRegistrationContext.Provider>
  );
}

export function useDeviceRegistration() {
  const ctx = useContext(DeviceRegistrationContext);
  if (!ctx) throw new Error("useDeviceRegistration must be used within DeviceRegistrationProvider");
  return ctx;
}
