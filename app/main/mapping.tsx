import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarMenu from "../../components/AvatarMenu";
import BackgroundWrapper from "../BackgroundWrapper";
import WebView from "react-native-webview";

interface Marker {
  lat: number;
  lng: number;
  title: string;
}

export default function MappingPage() {
  const router = useRouter();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const webViewRef = useRef<WebView>(null);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      handleMapPress(lat, lng);
      setInputLat('');
      setInputLng('');
    }
  };

  const handleMapPress = (lat: number, lng: number) => {
    const newMarker = {
      lat,
      lng,
      title: `Obstacle ${markers.length + 1}`
    };
    setMarkers([...markers, newMarker]);
  };

  const injectMarkersToMap = () => {
    const markersScript = `
      window.markers = ${JSON.stringify(markers)};
      if (window.updateMarkers) {
        window.updateMarkers();
      }
    `;
    webViewRef.current?.injectJavaScript(markersScript);
  };

  useEffect(() => {
    injectMarkersToMap();
  }, [markers]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; }
          #map { height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([14.5995, 120.9842], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          window.markers = [];
          var markersLayer = L.layerGroup().addTo(map);

          window.updateMarkers = function() {
            markersLayer.clearLayers();
            window.markers.forEach(function(marker) {
              L.marker([marker.lat, marker.lng])
                .bindPopup(
                  '<b>' + marker.title + '</b><br>' +
                  'Lat: ' + marker.lat.toFixed(6) + '<br>' +
                  'Lng: ' + marker.lng.toFixed(6)
                )
                .addTo(markersLayer);
            });
          };

          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapClick',
              lat: e.latlng.lat,
              lng: e.latlng.lng
            }));
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
            <View style={styles.coordinateInputs}>
              <View style={styles.inputWrapper}>
                <Text>Latitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLat}
                  onChangeText={setInputLat}
                  placeholder="Enter latitude"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputWrapper}>
                <Text>Longitude:</Text>
                <TextInput
                  style={styles.input}
                  value={inputLng}
                  onChangeText={setInputLng}
                  placeholder="Enter longitude"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleCoordinateSubmit}>
              <Text style={styles.buttonText}>Add Marker</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: htmlContent }}
              style={{ flex: 1 }}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'mapClick') {
                    handleMapPress(data.lat, data.lng);
                  }
                } catch (error) {
                  console.error('Error parsing message:', error);
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
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  coordinateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
    height: Dimensions.get('window').height - 150,
    flex: 1,
  },
});
