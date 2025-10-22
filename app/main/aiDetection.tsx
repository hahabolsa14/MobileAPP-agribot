import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsHeader from "../../components/TabsHeader";
import BackgroundWrapper from "../BackgroundWrapper";

export default function aiDetectionPage() {
  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <TabsHeader currentPage="Home" />

        <View style={styles.content}>
          <Text style={styles.title}>AI Mapping Placeholder</Text>
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
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
