import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsHeader from "../../components/TabsHeader";
import BackgroundWrapper from "../BackgroundWrapper";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <TabsHeader currentPage="Home" />

        {/* Title outside black box */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>AgriSafeNav</Text>
        </View>

        {/* Black container box for buttons */}
        <View style={styles.containerBox}>
          <View style={styles.buttonsContainer}>
            {[
              { label: "Bot Location", icon: "location-outline", route: "/main/botLocation" },
              // { label: "Path History", icon: "time-outline", route: "/main/pathHistory" },
              { label: "Mapping", icon: "map-outline", route: "/main/mapping" },
              { label: "AI Detection", icon: "scan-outline", route: "/main/aiDetection" },
            ].map((btn) => (
              <TouchableOpacity
                key={btn.label}
                style={styles.button}
                onPress={() => router.push(btn.route)}
              >
                <Ionicons name={btn.icon as any} size={24} color="#2e7d32" />
                <Text style={styles.buttonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 100, // space below TabsHeader
    marginBottom: 150,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#328435ff",
  },
  containerBox: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonsContainer: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    justifyContent: "flex-start",
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
});
