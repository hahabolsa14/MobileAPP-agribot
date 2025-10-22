import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "../BackgroundWrapper";

export default function AuthIndex() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          {/* Left: App Icon + Title */}
          <View style={styles.leftContainer}>
            <Ionicons name="leaf-outline" size={32} color="#2e7d32" />
            <Text style={styles.headerTitle}>AgriSafeNav</Text>
          </View>

          {/* Right: Auth Buttons */}
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/signin")}
            >
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push("/signup")}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Middle content */}
        <View style={styles.content}>
          <Text style={styles.title}>AgriSafeNav</Text>
          <Text style={styles.subtitle}>
            An autonomous ground vehicle for agricultural applications with
            drawn paths for field navigation.
          </Text>
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
    backgroundColor: "#000",       // black background
    borderWidth: 2,                // green outline thickness
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    zIndex: 10,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  signInButton: {
    backgroundColor: "#4CAF50",    // bright green for contrast
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  signInText: { 
    color: "#000",                 // black text on green button
    fontSize: 14, 
    fontWeight: "500" 
  },
  registerButton: {
    backgroundColor: "#fff",       // white button
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  registerText: { 
    color: "#000",             // dark green text to match theme
    fontSize: 14, 
    fontWeight: "500" 
  },
  content: {
    marginTop: 150,
    marginHorizontal: 40,
    zIndex: 3,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#000" },
  subtitle: { fontSize: 14, color: "#222", lineHeight: 20, textAlign: "left" },
});
