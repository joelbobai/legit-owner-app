import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { useDeviceRegistration } from "@/context/DeviceRegistrationContext";

export default function ContinueRegistration() {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const { token } = useAuth();
  const { setCategory, setImei, setImei2, updateDetails, data } = useDeviceRegistration();

  useEffect(() => {
    if (!deviceId || !token) return;

    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/device/smartphone/${deviceId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const device = res.data.device;
        if (!device) {
          router.replace("/(user)/(tabs)/devices");
          return;
        }

        const imei1 = device.identifiers?.imei1 || "";
        const imei2 = device.identifiers?.imei2 || "";

        setCategory(device.category || "smartphone");
        setImei(imei1);
        if (imei2) setImei2(imei2);

        updateDetails({
          deviceId: device._id,
          brand: device.brand || "",
          model: device.model || "",
          color: device.color || "",
          storage: device.storage || "",
          os: device.operatingSystem || "",
          condition: device.condition || "",
          purchaseDate: device.purchaseDate || "",
          notes: device.notes || "",
          serialNumber: device.identifiers?.serialNumber || "",
          modelNumber: device.identifiers?.deviceId || "",
          imeiProofImageUrl: "",
        });

        const step = device.registrationStep || 3;
        if (step <= 3) {
          router.replace("/(user)/register-device/step3");
        } else {
          router.replace("/(user)/register-device/step4");
        }
      } catch {
        router.replace("/(user)/(tabs)/devices");
      }
    })();
  }, [deviceId, token, setCategory, setImei, setImei2, updateDetails]);

  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color="#1A56FF" />
      <Text style={s.text}>Loading your registration...</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    gap: 16,
  },
  text: {
    fontSize: 15,
    color: "#4A4A4A",
    fontWeight: "500",
  },
});
