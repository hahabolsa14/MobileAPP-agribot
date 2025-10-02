import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundWrapper from "./BackgroundWrapper";

export default function SignIn() {
  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* White top bar same as landing page */}
        <View style={styles.headerOverlay}>
          <View style={styles.topBar}>
            <Ionicons name="car-sport-outline" size={28} color="black" />
            <Text style={styles.headerTitle}>Sign In</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Forgot password clicked!")}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  form: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    minHeight: 650,
  },
  label: { color: "#fff", marginBottom: 5, fontSize: 14 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#000", fontWeight: "bold" },
  forgotText: { color: "#aaa", textAlign: "center", textDecorationLine: "underline" },
});
