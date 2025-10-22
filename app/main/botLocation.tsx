import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsHeader from "../../components/TabsHeader";

const { height } = Dimensions.get("window");

interface BotLocation {
  lat: number;
  lng: number;
  lastUpdate: string;
  status: "online" | "offline" | "working";
}

export default function BotLocationPage() {
  const [botLocation, setBotLocation] = useState<BotLocation>({
    lat: 14.5995,
    lng: 120.9842,
    lastUpdate: new Date().toLocaleTimeString(),
    status: "online",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBotLocation((prev) => ({
        ...prev,
        lastUpdate: new Date().toLocaleTimeString(),
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#2e7d32";
      case "working":
        return "#ff9800";
      case "offline":
        return "#f44336";
      default:
        return "#666";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🧭 Header */}
      <TabsHeader currentPage="Home" />

      <View style={styles.container}>
        {/* Spacer (10%) */}
        <View style={styles.topSpacer} />

        {/* Status Section (20%) */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(botLocation.status) },
                ]}
              />
              <Text style={styles.statusText}>
                Bot Status:{" "}
                <Text
                  style={[
                    styles.statusValue,
                    { color: getStatusColor(botLocation.status) },
                  ]}
                >
                  {botLocation.status.toUpperCase()}
                </Text>
              </Text>
            </View>
            <Text style={styles.lastUpdate}>
              Last Update: {botLocation.lastUpdate}
            </Text>
          </View>

          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateItem}>
              <Ionicons name="location" size={16} color="#2e7d32" />
              <Text style={styles.coordinateLabel}>Latitude:</Text>
              <Text style={styles.coordinateValue}>
                {botLocation.lat.toFixed(6)}
              </Text>
            </View>
            <View style={styles.coordinateItem}>
              <Ionicons name="location" size={16} color="#2e7d32" />
              <Text style={styles.coordinateLabel}>Longitude:</Text>
              <Text style={styles.coordinateValue}>
                {botLocation.lng.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer (20%) */}
        <View style={styles.middleSpacer} />

        {/* Map Section (50%) */}
        <View style={styles.mapSection}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: botLocation.lat,
              longitude: botLocation.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: botLocation.lat,
                longitude: botLocation.lng,
              }}
              title="🤖 AgriSafeNav"
              description={`Status: ${botLocation.status.toUpperCase()}\nLast Update: ${botLocation.lastUpdate}`}
              pinColor={getStatusColor(botLocation.status)}
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },

  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },

  // 🟩 Spacers
  topSpacer: {
    height: height * 0.03, // 10% top space
  },
  middleSpacer: {
    height: height * 0.05, // 20% between sections
  },

  // 🟦 Status Section (20%)
  statusSection: {
    height: height * 0.2,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 8,
  },

  // 🗺️ Map Section (50%)
  mapSection: {
    height: height * 0.6,
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },

  map: {
    flex: 1,
  },

  // Status info
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 16,
    color: "#FFF",
  },
  statusValue: {
    fontWeight: "600",
  },
  lastUpdate: {
    fontSize: 12,
    color: "#B0B0B0",
  },

  coordinatesContainer: {
    gap: 10,
  },
  coordinateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coordinateLabel: {
    color: "#B0B0B0",
    fontSize: 14,
    minWidth: 70,
  },
  coordinateValue: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 14,
  },
});
