import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { styles } from "../styles/styles";

const MapComponent = ({ onSelectLocation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const mapViewRef = useRef(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Error", "grant permissions for location");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCurrentLocation({
          name: "Current Location",
          coordinate: { latitude, longitude },
        });
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };
    getLocation();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      name: "Selected Location",
      coordinate,
    });
    console.log(coordinate);
    onSelectLocation(coordinate); // Pass selected location back to the parent component
  };

  const handleShowCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      mapViewRef.current.animateToRegion({
        ...currentLocation.coordinate,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      onSelectLocation(currentLocation.coordinate); // Pass selected location back to the parent component
    }
  };

  return (
    <View style={styles.mapContainer}>
      <Text style={styles.mapLabel}>Select Location:</Text>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: 31.369831,
          longitude: 73.144733,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation.coordinate}
            title="Current Location"
            description={currentLocation.name}
            pinColor="blue"
          />
        )}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation.coordinate}
            title="Selected Location"
            description={selectedLocation.name}
            pinColor="red"
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleShowCurrentLocation}
      >
        <Text style={styles.currentLocationButtonText}>
          Show Current Location
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapComponent;
