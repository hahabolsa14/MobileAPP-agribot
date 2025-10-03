import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu"; // reusable component
import BackgroundWrapper from "../BackgroundWrapper";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Ionicons name="car-sport-outline" size={28} color="black" />

          <View style={styles.rightContainer}>
            {/* Navigation Tabs */}
            <View style={styles.navTabs}>
              <TouchableOpacity style={styles.tabActive}>
                <Text style={styles.tabTextActive}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push("/(tabs)/about")}
              >
                <Text style={styles.tabText}>About Us</Text>
              </TouchableOpacity>
            </View>

            {/* Reusable Avatar Menu */}
            <AvatarMenu currentPage="Home" />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>EcoVenture</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/main/botLocation")}
          >
            <Ionicons
              name="location-outline"
              size={24}
              color="#2e7d32"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Bot Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/main/pathHistory")}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color="#2e7d32"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Path History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/main/mapping")}
          >
            <Ionicons
              name="map-outline"
              size={24}
              color="#2e7d32"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Mapping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: "100%",
    marginTop: 0,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navTabs: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 5,
    padding: 2,
  },
  tab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tabActive: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  tabText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  titleContainer: {
    marginTop: 120,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#122909",
  },
  buttonsContainer: {
    marginTop: 160,
    alignItems: "center",
    gap: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
});
