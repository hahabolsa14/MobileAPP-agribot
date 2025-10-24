import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      {/* Left: Leaf Icon */}
      <View style={styles.leftContainer}>
        <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
      </View>

      {/* Center: Page Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Right: Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    borderColor: "#4CAF50",
    borderWidth: 0.2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
    textAlign: "center",
    flex: 1, // allows the title to stay centered
    marginHorizontal: 10,
  },
});
