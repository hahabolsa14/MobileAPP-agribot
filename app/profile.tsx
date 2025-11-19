import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import BackgroundWrapper from "./BackgroundWrapper";
import { useAuth } from "../utils/authHelpers";

interface UserProfile {
  displayName: string;
  farmName: string;
  location: string;
  farmSize: string;
  cropTypes: string;
  phoneNumber: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    farmName: "",
    location: "",
    farmSize: "",
    cropTypes: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) {
      console.log("No user logged in");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Loading profile for user:", user.uid);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        console.log("Profile loaded successfully");
      } else {
        console.log("No profile document exists, using default");
        setProfile(prev => ({
          ...prev,
          displayName: user.displayName || ""
        }));
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Don't show alert if it's just missing permissions - let user continue
      if (error.code === 'permission-denied') {
        console.warn("Permission denied - Firestore rules may need updating");
        // Set default profile from auth
        setProfile(prev => ({
          ...prev,
          displayName: user.displayName || ""
        }));
      } else {
        Alert.alert("Error", `Failed to load profile: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      if (profile.displayName && profile.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: profile.displayName
        });
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...profile,
          updatedAt: new Date()
        });
      } else {
        await setDoc(docRef, {
          ...profile,
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/(auth)");
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>My Profile</Text>
          
            <View style={styles.section}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.readOnlyContainer}>
                <Text style={styles.readOnlyText}>{user?.email}</Text>
              </View>
            </View>

          <View style={styles.section}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={profile.displayName}
              onChangeText={(text) => setProfile({ ...profile, displayName: text })}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Farm Name</Text>
            <TextInput
              style={styles.input}
              value={profile.farmName}
              onChangeText={(text) => setProfile({ ...profile, farmName: text })}
              placeholder="Enter your farm name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(text) => setProfile({ ...profile, location: text })}
              placeholder="City, Country"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Farm Size (hectares)</Text>
            <TextInput
              style={styles.input}
              value={profile.farmSize}
              onChangeText={(text) => setProfile({ ...profile, farmSize: text })}
              placeholder="e.g., 5.0"
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Crop Types</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={profile.cropTypes}
              onChangeText={(text) => setProfile({ ...profile, cropTypes: text })}
              placeholder="e.g., Rice, Corn, Vegetables"
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profile.phoneNumber}
              onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4CAF50",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
    marginBottom: 8,
  },
  readOnlyContainer: {
    backgroundColor: "#2C2C2C",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#404040",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#2C2C2C",
    borderWidth: 1,
    borderColor: "#404040",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#FFFFFF",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
