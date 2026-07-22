import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import Svg, { Path } from "react-native-svg";

import { FontFamily } from "@/constants/typography";

type Props = {
  visible: boolean;
  authorizationUrl: string;
  callbackUrl: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
};

export default function PaystackWebView({
  visible,
  authorizationUrl,
  callbackUrl,
  onSuccess,
  onCancel,
  onError,
}: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const handledRef = useRef(false);

  const callbackPrefix = callbackUrl.split("?")[0];

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      const url = navState.url;
      if (handledRef.current) return;
      if (!url.startsWith(callbackPrefix)) return;
      handledRef.current = true;

      const refMatch = url.match(/[?&]reference=([^&]*)/);
      const trxrefMatch = url.match(/[?&]trxref=([^&]*)/);
      const reference = refMatch?.[1] || trxrefMatch?.[1];

      if (reference) {
        onSuccess(decodeURIComponent(reference));
      } else {
        onError("Payment reference not found in callback");
      }
    },
    [callbackPrefix, onSuccess, onError],
  );

  const handleClose = useCallback(() => {
    if (handledRef.current) return;
    handledRef.current = true;
    onCancel();
  }, [onCancel]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeBtn} hitSlop={8}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 6L18 18M18 6L6 18"
                stroke="#0D0D0D"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
          <Text style={styles.title}>Complete Payment</Text>
          <View style={styles.spacer} />
        </View>

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#1A56FF" />
            <Text style={styles.loadingText}>Loading payment page...</Text>
          </View>
        )}

        <WebView
          source={{ uri: authorizationUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#0D0D0D",
    fontFamily: FontFamily.semibold,
    textAlign: "center",
  },
  spacer: {
    width: 44,
  },
  loading: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#94A3B8",
    fontFamily: FontFamily.regular,
    marginTop: 12,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
