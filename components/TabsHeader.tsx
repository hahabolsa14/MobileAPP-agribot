import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AvatarMenu from "./AvatarMenu";

interface TabsHeaderProps {
  currentPage: "Home" | "About";
}

export default function TabsHeader({ currentPage }: TabsHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      {/* App Icon + Title */}
      <View style={styles.leftContainer}>
        <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
        <Text style={styles.headerTitle}>AgriSafeNav</Text>
      </View>

      {/* Navigation Tabs + Avatar */}
      <View style={styles.rightContainer}>
        <View style={styles.navTabs}>
          <TouchableOpacity
            style={currentPage === "Home" ? styles.tabActive : styles.tab}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={currentPage === "Home" ? styles.tabTextActive : styles.tabText}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={currentPage === "About" ? styles.tabActive : styles.tab}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/about")}
          >
            <Text style={currentPage === "About" ? styles.tabTextActive : styles.tabText}>
              About Us
            </Text>
          </TouchableOpacity>
        </View>

        <AvatarMenu currentPage={currentPage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000",          // black background
    borderWidth: 2,                    // green outline thickness
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    zIndex: 10,                        // ensure touches work on Android
    overflow: "visible",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginLeft: 5,
  },
  navTabs: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  tabActive: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    borderRadius: 15,
    backgroundColor: "#fff",
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
});