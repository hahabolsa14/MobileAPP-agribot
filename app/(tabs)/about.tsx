import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu"; // reusable component
import BackgroundWrapper from "../BackgroundWrapper";

export default function AboutScreen() {
  const router = useRouter();

  // State for inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    Alert.alert("Message Sent", "Thank you for contacting us!");
    setFirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Ionicons name="car-sport-outline" size={28} color="black" />

          <View style={styles.rightContainer}>
            {/* Navigation Tabs */}
            <View style={styles.navTabs}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push("/(tabs)/home")}
              >
                <Text style={styles.tabText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabActive}>
                <Text style={styles.tabTextActive}>About Us</Text>
              </TouchableOpacity>
            </View>

            {/* Reusable Avatar Menu */}
            <AvatarMenu currentPage="About" />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        >
          {/* Banner / Header Image */}
          <Image
            source={{ uri: "https://i.ibb.co/0Vh6nQv/field-banner.jpg" }}
            style={styles.bannerImage}
          />

          {/* About Us Section */}
          <View style={styles.content}>
            <Text style={styles.title}>About Us</Text>
            <Text style={styles.paragraph}>
              At EcoVentureBot, we are committed to revolutionizing the
              agricultural landscape with cutting-edge autonomous technology.
            </Text>
            <Text style={styles.paragraph}>
              EcoVentureBot designs and develops autonomous ground vehicles
              (AGVs) tailored for agricultural applications. Using smart navigation,
              AI-driven analytics, and real-time data, our vehicles automate key
              farming tasks like precision planting, irrigation, crop monitoring,
              and soil analysis. The result? A more efficient, sustainable, and
              cost-effective way to manage agricultural operations.
            </Text>
          </View>

          {/* Contact Us Section */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Contact us</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your message</Text>
              <TextInput
                style={[styles.inputBox, { height: 100, textAlignVertical: "top" }]}
                placeholder="Enter your question or message"
                multiline
                value={message}
                onChangeText={setMessage}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  bannerImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#122909",
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
  },
  contactContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  inputBox: {
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    marginTop: 15,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
