import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import PageHeader from "../../components/PageHeader";

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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    requestLocationPermission();
    
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

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

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

  const calculateDistance = () => {
    if (!userLocation) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (botLocation.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (botLocation.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(botLocation.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(2)}km`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 🧭 Header */}
      <PageHeader title="Bot Location" />

      <View style={styles.container}>
        {/* Spacer (10%) */}
        <View style={styles.topSpacer} />

        {/* Status Section */}
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
            {userLocation && (
              <View style={styles.coordinateItem}>
                <Ionicons name="navigate" size={16} color="#4CAF50" />
                <Text style={styles.coordinateLabel}>Distance:</Text>
                <Text style={styles.coordinateValue}>
                  {calculateDistance()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.middleSpacer} />

        {/* Map Placeholder Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={64} color="#4CAF50" />
            <Text style={styles.mapPlaceholderTitle}>Map View</Text>
            <Text style={styles.mapPlaceholderText}>
              Bot Location: {botLocation.lat.toFixed(4)}, {botLocation.lng.toFixed(4)}
            </Text>
            {userLocation && (
              <Text style={styles.mapPlaceholderText}>
                Your Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={requestLocationPermission}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.refreshButtonText}>Refresh Location</Text>
            </TouchableOpacity>
          </View>
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

  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
