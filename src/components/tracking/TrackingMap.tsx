import { memo, useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Svg, { Circle, Path } from "react-native-svg";
import { Device } from "@/types/device";

type Props = {
  devices: Device[];
  selectedDeviceId?: string;
};

function CompassIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.5" fill="none" />
      <Path d="M11 5V7M11 15V17M5 11H7M15 11H17" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <Circle cx="11" cy="11" r="2" fill="white" opacity="0.7" />
      <Path d="M11 8L13 11L11 10L9 11L11 8Z" fill="white" />
    </Svg>
  );
}

function CenterIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle cx="10" cy="10" r="3" stroke="white" strokeWidth="1.5" fill="none" />
      <Path d="M10 2V5M10 15V18M2 10H5M15 10H18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <View style={p.wrapper}>
      <View style={p.body}>
        <View style={p.speaker} />
        <View style={p.screen} />
        <View style={p.homeBtn} />
      </View>
    </View>
  );
}

const p = StyleSheet.create({
  wrapper: {
    width: 20,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    width: 18,
    height: 28,
    borderRadius: 4,
    borderWidth: 2.2,
    borderColor: "white",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3,
    justifyContent: "space-between",
  },
  speaker: {
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: "white",
    opacity: 0.6,
  },
  screen: {
    flex: 1,
    width: "100%",
  },
  homeBtn: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.5,
    borderColor: "white",
    opacity: 0.7,
  },
});

function PulseMarker({ isOnline }: { isOnline: boolean }) {
  const scale1 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity2 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isOnline) {
      scale1.setValue(1);
      opacity1.setValue(0);
      scale2.setValue(1);
      opacity2.setValue(0);
      return;
    }
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale1, { toValue: 2.8, duration: 2200, useNativeDriver: true }),
          Animated.timing(opacity1, { toValue: 0, duration: 2200, useNativeDriver: true }),
        ]),
        Animated.timing(scale1, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(opacity1, { toValue: 0.6, duration: 0, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale2, { toValue: 2.8, duration: 2200, useNativeDriver: true }),
          Animated.timing(opacity2, { toValue: 0, duration: 2200, useNativeDriver: true }),
        ]),
        Animated.timing(scale2, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(opacity2, { toValue: 0.4, duration: 0, useNativeDriver: true }),
      ]),
      { iterations: -1 }
    );
    loop1.start();
    loop2.start();
    return () => {
      loop1.stop();
      loop2.stop();
    };
  }, [isOnline]);

  return (
    <View style={m.outer}>
      {isOnline && (
        <>
          <Animated.View
            style={[m.pulse, { transform: [{ scale: scale1 }], opacity: opacity1 }]}
          />
          <Animated.View
            style={[
              m.pulse,
              {
                transform: [{ scale: scale2 }],
                opacity: opacity2,
                backgroundColor: "rgba(26,86,255,0.25)",
              },
            ]}
          />
        </>
      )}
      <View style={m.pin}>
        <PhoneIcon />
      </View>
    </View>
  );
}

const m = StyleSheet.create({
  outer: {
    width: 56,
    height: 60,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  pulse: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1A56FF",
    bottom: 22,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A56FF",
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
    zIndex: 10,
    elevation: 10,
  },
});

const LAGOS = {
  latitude: 6.5244,
  longitude: 3.3792,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function TrackingMap({ devices, selectedDeviceId }: Props) {
  const mapRef = useRef<MapView>(null);
  const selected = devices.find((d) => d.id === selectedDeviceId);
  const isOnline = true;

  const handleCenter = () => {
    if (selected?.lastKnownLocation) {
      mapRef.current?.animateToRegion({
        latitude: selected.lastKnownLocation.latitude,
        longitude: selected.lastKnownLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  return (
    <View style={s.container}>
      <MapView
        ref={mapRef}
        style={s.map}
        initialRegion={LAGOS}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        {devices.map((device) => {
          if (!device.lastKnownLocation) return null;
          const isSel = device.id === selectedDeviceId;
          return (
            <Marker
              key={device.id}
              coordinate={{
                latitude: device.lastKnownLocation.latitude,
                longitude: device.lastKnownLocation.longitude,
              }}
              anchor={{ x: 0.5, y: 1 }}
              tracksViewChanges={!isSel}
            >
              <PulseMarker isOnline={isSel && isOnline} />
            </Marker>
          );
        })}
      </MapView>

      <View style={s.liveBubble} pointerEvents="none">
        <View style={s.liveDot} />
        <Text style={s.liveText}>
          {isOnline ? "Live · Abuja, Nigeria" : "Last seen 2 hrs ago · Abuja"}
        </Text>
      </View>

      <View style={s.controls}>
        <Pressable style={s.controlBtn}>
          <CompassIcon />
        </Pressable>
        <Pressable style={s.controlBtn} onPress={handleCenter}>
          <CenterIcon />
        </Pressable>
      </View>

      <View style={s.accuracyBadge} pointerEvents="none">
        <Text style={s.accuracyText}>Accuracy: ±50m</Text>
      </View>

      <View style={s.mapBottomFade} pointerEvents="none" />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  liveBubble: {
    position: "absolute",
    top: 14,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#0D0D0D",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
  },
  liveText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  controls: {
    position: "absolute",
    top: 14,
    right: 14,
    gap: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(26,86,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A56FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  accuracyBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  accuracyText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  mapBottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "transparent",
  },
});

export default memo(TrackingMap);
