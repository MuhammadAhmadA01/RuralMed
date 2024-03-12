import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, FlatList, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { styles } from "../styles/styles";
import { Searchbar } from "react-native-paper";
import IP_ADDRESS from "../../config/config";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
const MapScreen = ({ route, navigation }) => {
  const { onSelectLocation } = route.params;
  const mapViewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFlatListVisible, setIsFlatListVisible] = useState(true); // New state

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = {"latitude": 31.421794, "longitude": 73.065469};
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
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.coordinate);
      navigation.goBack(); // Navigate back to the Signup screen
    }
  }; const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      name: "Selected Location",
      coordinate,
    });
    onSelectLocation(coordinate);
    setIsFlatListVisible(false); // Hide FlatList when an item is selected
  };

  const handleShowCurrentLocation = () => {
    
    if (currentLocation) {
      const { latitude, longitude } = {"latitude": 31.421794, "longitude": 73.065469};
      setSelectedLocation(currentLocation);
  
      mapViewRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0923,
        longitudeDelta: 0.0422,
      });
  
      onSelectLocation(currentLocation.coordinate);
      setIsFlatListVisible(false); // Hide FlatList when showing current location
    }
  };
  
  const handleLocationSearch = () => {
    const apiUrl = `http://${IP_ADDRESS}:5000/api/search/${searchQuery}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setSearchResults(data);
        setIsFlatListVisible(true); // Show FlatList when search results are available
      })
      .catch(error => {
        console.error("Error fetching location data:", error);
      });
  };

  const handleSelectLocation = (item) => {
    console.log("Selected Location Item:", item);

    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lon);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      setSelectedLocation({
        name: item.display_name,
        coordinate: { latitude, longitude },
      });

      mapViewRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0923,
        longitudeDelta: 0.0422,
      });

      setIsFlatListVisible(false); // Hide FlatList when an item is selected
    } else {
      console.error("Invalid coordinates");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        style={{
          position: "relative",
          top: 39,
          left: 0,
          right: 0,
          backgroundColor: "white",
          zIndex: 1,
        }}
        inputStyle={{ color: "black" }}
        placeholder="Search Location..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleLocationSearch}
      />

      {isFlatListVisible && searchQuery.length > 0 && (
        <FlatList
          style={{ marginTop: 44 }}
          data={searchResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginVertical: 5, marginHorizontal: 10 }} onPress={() => handleSelectLocation(item)}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.display_place}</Text>
              <Text>{item.display_address}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <MapView
        ref={mapViewRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 31.421794,
          longitude: 73.065469,
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
            title={selectedLocation.name}
            pinColor="red"
          />
        )}
      </MapView>
      {selectedLocation && (
        <TouchableOpacity
          style={[styles.fab, { bottom: 80 }]}
          onPress={handleConfirmLocation}
        >
          <FontAwesome name="check" size={24} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.fab]}
        onPress={handleShowCurrentLocation}
      >
<Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;
