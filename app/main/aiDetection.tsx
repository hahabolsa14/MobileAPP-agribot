import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image as RNImage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsHeader from "../../components/TabsHeader"; // make sure the path is correct

interface Detection {
  bbox: [number, number, number, number];
  confidence: number;
  class_id: number;
  class_name: string;
}

interface DetectionResult {
  detections: Detection[];
  image_size: [number, number];
  processing_time: number;
  model_info: string;
  annotated_image?: string;
  obstruction_analysis: {
    has_obstruction: boolean;
    obstruction_count: number;
    animal_count: number;
    object_count: number;
    person_count: number;
    severity: string;
    confidence: number;
    status_message: string;
  };
  navigation: {
    can_proceed: boolean;
    recommended_action: string;
    path_status: string;
    safety_score: number;
  };
}

export default function AIDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setDetectionResults(null);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setDetectionResults(null);
    setUploadProgress(0);
  };

  const processImage = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(10);

    try {
      const base64Image = await FileSystem.readAsStringAsync(selectedImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setUploadProgress(40);

      const apiResponse = await fetch("http://192.168.56.1:8000/detect_base64", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      setUploadProgress(80);

      if (!apiResponse.ok) throw new Error(`API Error: ${apiResponse.status}`);

      const results = await apiResponse.json();
      processRealObstructionResults(results);

      Alert.alert("Success", "Obstruction analysis complete!");
      setUploadProgress(100);
    } catch (error) {
      console.error("Detection error:", error);
      Alert.alert(
        "Detection Error",
        "Failed to process the image. Switching to demo mode."
      );
      await simulateDetection();
      processDemoObstructionResults();
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const simulateDetection = () => new Promise(resolve => setTimeout(resolve, 2000));

  const processRealObstructionResults = (apiResults: any) => {
    let personCount = 0;
    let animalCount = 0;
    let objectCount = 0;
    const obstructionDetections: Detection[] = [];

    if (apiResults && apiResults.detections) {
      apiResults.detections.forEach((detection: any) => {
        let obstructionType = detection.class_name.toLowerCase();
        if (obstructionType.includes("person")) {
          personCount++;
          obstructionType = "person";
        } else if (obstructionType.includes("animal")) {
          animalCount++;
          obstructionType = "animal";
        } else {
          objectCount++;
          obstructionType = "object";
        }
        obstructionDetections.push({
          bbox: detection.bbox,
          confidence: detection.confidence,
          class_id: detection.class_id,
          class_name: obstructionType,
        });
      });
    }

    const totalObstructions = personCount + animalCount + objectCount;
    const hasObstruction = totalObstructions > 0;

    const realResults: DetectionResult = {
      detections: obstructionDetections,
      image_size: apiResults?.image_size || [350, 300],
      processing_time: apiResults?.processing_time || 0,
      model_info: apiResults?.model_info || "RT-DETR Obstruction Detection",
      annotated_image: apiResults?.annotated_image,
      obstruction_analysis: {
        has_obstruction: hasObstruction,
        obstruction_count: totalObstructions,
        animal_count: animalCount,
        object_count: objectCount,
        person_count: personCount,
        severity: totalObstructions > 5 ? "HIGH" : totalObstructions > 0 ? "MEDIUM" : "LOW",
        confidence: 0.85,
        status_message: hasObstruction
          ? `${totalObstructions} OBSTRUCTION${totalObstructions > 1 ? "S" : ""} DETECTED`
          : "PATH CLEAR",
      },
      navigation: {
        can_proceed: !hasObstruction,
        recommended_action: hasObstruction
          ? personCount > 0 || totalObstructions > 3
            ? "STOP_AND_WAIT"
            : "PROCEED_WITH_CAUTION"
          : "PROCEED",
        path_status: hasObstruction
          ? personCount > 0 || totalObstructions > 3
            ? "BLOCKED"
            : "CAUTION"
          : "CLEAR",
        safety_score: hasObstruction ? Math.max(5, 100 - totalObstructions * 10) : 100,
      },
    };

    setDetectionResults(realResults);
  };

  const processDemoObstructionResults = () => {
    const detections: Detection[] = [
      { bbox: [50, 80, 200, 180], confidence: 0.92, class_id: 0, class_name: "animal" },
      { bbox: [220, 120, 320, 220], confidence: 0.87, class_id: 1, class_name: "person" },
      { bbox: [30, 200, 120, 280], confidence: 0.75, class_id: 2, class_name: "object" },
    ];
    const total = detections.length;

    setDetectionResults({
      detections,
      image_size: [350, 300],
      processing_time: 1.2,
      model_info: "Demo Mode - Obstruction Detection",
      obstruction_analysis: {
        has_obstruction: true,
        obstruction_count: total,
        animal_count: 1,
        object_count: 1,
        person_count: 1,
        severity: "HIGH",
        confidence: 0.87,
        status_message: `${total} OBSTRUCTION(S) DETECTED`,
      },
      navigation: {
        can_proceed: false,
        recommended_action: "STOP_AND_WAIT",
        path_status: "BLOCKED",
        safety_score: 50,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <TabsHeader currentPage="Home" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Ionicons name="hardware-chip-outline" size={32} color="#2e7d32" />
            <Text style={styles.headerTitle}>Obstruction Detection</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Upload an image to detect obstructions in your path.
          </Text>
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Image</Text>

          {!selectedImage ? (
            <View style={styles.uploadArea}>
              <Ionicons name="scan-outline" size={48} color="#666" />
              <Text style={styles.uploadText}>Tap to upload an image</Text>
              <Text style={styles.uploadSubtext}>
                Detect obstructions in your navigation path
              </Text>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#fff" />
                <Text style={styles.uploadButtonText}>Select Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePreview}>
              <RNImage source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
              <View style={styles.imageActions}>
                <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearImage}>
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.processButton]}
                  onPress={processImage}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="scan-outline" size={16} color="#fff" />
                  )}
                  <Text style={styles.actionButtonText}>
                    {isProcessing ? "Processing..." : "Detect Objects"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isProcessing && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Processing image... {uploadProgress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}
        </View>

        {detectionResults && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Detection Results</Text>

            {detectionResults.annotated_image ? (
              <RNImage
                source={{ uri: `data:image/jpeg;base64,${detectionResults.annotated_image}` }}
                style={styles.annotatedImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.uploadSubtext}>No annotated image available</Text>
            )}

            <View
              style={[
                styles.obstructionAlert,
                {
                  backgroundColor: detectionResults.obstruction_analysis.has_obstruction
                    ? detectionResults.navigation.path_status === "BLOCKED"
                      ? "#ffebee"
                      : "#fff3e0"
                    : "#e8f5e8",
                },
              ]}
            >
              <View style={styles.alertHeader}>
                <Ionicons
                  name={
                    detectionResults.obstruction_analysis.has_obstruction
                      ? "warning"
                      : "checkmark-circle"
                  }
                  size={24}
                  color={
                    detectionResults.obstruction_analysis.has_obstruction
                      ? detectionResults.navigation.path_status === "BLOCKED"
                        ? "#d32f2f"
                        : "#f57c00"
                      : "#2e7d32"
                  }
                />
                <Text
                  style={[
                    styles.alertTitle,
                    {
                      color: detectionResults.obstruction_analysis.has_obstruction
                        ? detectionResults.navigation.path_status === "BLOCKED"
                          ? "#d32f2f"
                          : "#f57c00"
                        : "#2e7d32",
                    },
                  ]}
                >
                  {detectionResults.navigation.path_status}
                </Text>
              </View>
              <Text style={styles.alertMessage}>
                {detectionResults.obstruction_analysis.status_message}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20, backgroundColor: "#121212" },
  headerSection: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "600", color: "#FFFFFF" },
  headerSubtitle: { fontSize: 14, color: "#B0B0B0" },
  uploadSection: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 10 },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#404040",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#2C2C2C",
  },
  uploadText: { fontSize: 16, color: "#B0B0B0", marginTop: 10 },
  uploadSubtext: { fontSize: 14, color: "#808080", marginTop: 5 },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  imagePreview: { alignItems: "center" },
  previewImage: { width: "100%", height: 300, borderRadius: 8, marginBottom: 15 },
  imageActions: { flexDirection: "row", gap: 10 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  clearButton: { backgroundColor: "#f44336" },
  processButton: { backgroundColor: "#2e7d32" },
  actionButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  progressContainer: { marginTop: 15 },
  progressText: { fontSize: 14, color: "#B0B0B0", textAlign: "center" },
  progressBar: { height: 6, backgroundColor: "#2C2C2C", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#4CAF50" },
  resultsSection: { backgroundColor: "#1E1E1E", borderRadius: 12, padding: 20 },
  annotatedImage: { width: "100%", height: 250, borderRadius: 8 },
  obstructionAlert: { borderRadius: 12, padding: 16, marginTop: 15 },
  alertHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  alertTitle: { fontSize: 18, fontWeight: "600" },
  alertMessage: { fontSize: 14, color: "#B0B0B0" },
});
