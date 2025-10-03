import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import BackgroundWrapper from "../BackgroundWrapper";

export default function TabLayout() {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" />
          <Stack.Screen name="about" />
        </Stack>
      </View>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
