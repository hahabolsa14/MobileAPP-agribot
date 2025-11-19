import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";
import WebView from "react-native-webview";
import { useAuth } from "../../utils/authHelpers";
import { saveMapMarkers, getMapMarkers } from "../../utils/mapHelpers";

interface Marker {
  lat: number;
  lng: number;
  title: string;
}

export default function MappingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const webViewRef = useRef<WebView>(null);

  const loadMarkersFromFirebase = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to view markers');
      return;
    }
    const loadedMarkers = await getMapMarkers(user.uid);
    if (loadedMarkers) {
      setMarkers(loadedMarkers);
      Alert.alert('Success', `Loaded ${loadedMarkers.length} marker(s)`);
      // Ensure map updates with loaded markers
      webViewRef.current?.injectJavaScript(`
        if (mapReady) {
          window.markers = ${JSON.stringify(loadedMarkers)};
          window.updateMarkers();
          map.invalidateSize();
        }
      ` + '; true;');
    }
  };

  const removeAllMarkers = () => {
    Alert.alert(
      'Clear Markers',
      'Are you sure you want to clear the displayed markers?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setMarkers([]);
          }
        }
      ]
    );
  };

  const injectMarkersToMap = () => {
    const markersScript = `
      window.markers = ${JSON.stringify(markers)};
      if (window.updateMarkers) {
        window.updateMarkers();
      }
    `;
    webViewRef.current?.injectJavaScript(markersScript + '; true;');
  };

  useEffect(() => {
    injectMarkersToMap();
  }, [markers]);

  useEffect(() => {
    if (user?.uid) {
      loadMarkersFromFirebase();
    }
  }, [user]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #map {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var mapReady = false;
          var map = L.map('map', {
            zoomControl: true,
            attributionControl: true,
            maxZoom: 19,
            minZoom: 3
          }).setView([14.5995, 120.9842], 15);

          map.whenReady(function() {
            mapReady = true;
            if (window.markers && window.markers.length > 0) {
              window.updateMarkers();
            }
          });
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          window.markers = [];
          var markersLayer = L.layerGroup().addTo(map);

          let markersMap = new Map();
          
          // Ensure markers stay visible during zoom/pan
          map.on('zoomend moveend', function() {
            if (window.updateMarkers) {
              window.updateMarkers();
            }
          });

          window.updateMarkers = function() {
            if (!mapReady) return;

            // Clear all existing markers if there are no markers in the data
            if (!window.markers || window.markers.length === 0) {
              markersMap.forEach((existingMarker) => {
                markersLayer.removeLayer(existingMarker);
              });
              markersMap.clear();
              return;
            }

            // Remove markers that no longer exist
            markersMap.forEach((existingMarker, id) => {
              if (!window.markers.find(m => m.title === id)) {
                markersLayer.removeLayer(existingMarker);
                markersMap.delete(id);
              }
            });

            // Update or add new markers
            window.markers.forEach(function(marker) {
              if (!markersMap.has(marker.title)) {
                const newMarker = L.marker([marker.lat, marker.lng], {
                  autoPan: false,
                  riseOnHover: true
                }).bindPopup(
                  '<b>' + marker.title + '</b><br>' +
                  'Lat: ' + marker.lat.toFixed(6) + '<br>' +
                  'Lng: ' + marker.lng.toFixed(6)
                );
                markersLayer.addLayer(newMarker);
                markersMap.set(marker.title, newMarker);
              }
            });
            
            // Force a map update to ensure markers are visible
            map.invalidateSize();
          };

          map.on('click', function(e) {
            // Click handler disabled - map is view-only
          });
        </script>
      </body>
    </html>
  `;

  return (
    <BackgroundWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <Ionicons name="car-sport-outline" size={28} color="black" />
          <View style={styles.rightContainer}>
            <AvatarMenu currentPage="Mapping" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Field Mapping</Text>
          <View style={styles.inputContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.loadButton} onPress={loadMarkersFromFirebase}>
                <Text style={styles.buttonText}>Show Latest Markers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={removeAllMarkers}>
                <Text style={styles.buttonText}>Clear Markers</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              onLayout={() => {
                webViewRef.current?.injectJavaScript('if (mapReady) { map.invalidateSize(); window.updateMarkers(); }; true;');
              }}
              scrollEnabled={false}
              bounces={false}
              onLoadEnd={() => {
                if (markers.length > 0) {
                  injectMarkersToMap();
                }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#333333',
  },
  loadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
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
    marginBottom: 10,
  },
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});