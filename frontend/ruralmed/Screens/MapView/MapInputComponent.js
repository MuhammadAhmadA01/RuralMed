import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {Appbar} from 'react-native-paper'
import * as Location from "expo-location";
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {styles} from "../styles/styles";

const MapScreen = ({ route, navigation }) => {
  const { onSelectLocation } = route.params;
  const mapViewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
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

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.coordinate);
      navigation.goBack(); // Navigate back to the Signup screen
    }
  }; 
  const handleSelectLocation = (item) => {
    console.log("Selected Location Item:", item);
    console
    const latitude = parseFloat(item.lat);
    const longitude = parseFloat(item.lng);
    console.log(latitude)
    if (!isNaN(latitude) && !isNaN(longitude)) {
      setSelectedLocation({
        name: item.name,
        coordinate: { latitude, longitude },
      });

      mapViewRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0923,
        longitudeDelta: 0.0422,
      });

    } else {
      console.error("Invalid coordinates");
    }
  };



  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      name: "Selected Location",
      coordinate,
    });
    onSelectLocation(coordinate);
  };

  const handleShowCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      mapViewRef.current.animateToRegion({
        ...currentLocation.coordinate,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
          <Appbar.Header style={{ backgroundColor: "#25d366" }}>
    
         <Appbar.BackAction  onPress={() => navigation.goBack()} >
          
          
          </Appbar.BackAction>
          <Appbar.Content title="Back" />
    </Appbar.Header>
      {showList ? (
        <GooglePlacesAutocomplete
          placeholder=" Choose a Location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            setShowList(false); // Hide GooglePlacesAutocomplete when a location is selected
            setSelectedLocation({
              name: data.description,
              coordinate: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng
              }
            });
            handleSelectLocation(details.geometry.location);
          }}
          query={{
            key: "AIzaSyAKf_nwOWdrOkH37UjmixQKqKJfPebfBZY",
            language: "en",
          }}
        />
      ) : (
        <MapView
          ref={mapViewRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: selectedLocation?selectedLocation.coordinate.latitude:31.421794,
            longitude: selectedLocation?selectedLocation.coordinate.longitude:73.065469,
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
      )}
      
      {/* Conditionally render the tick button only when a location is selected */}
      {selectedLocation && (
        <TouchableOpacity
          style={[styles.fab, { bottom: 80 }]}
          onPress={handleConfirmLocation}
        >
          <FontAwesome name="check" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Buttons for handling current location and toggling search */}
     
      <TouchableOpacity
        style={[styles.fab, { bottom: 16, right: 16, position: 'absolute' }]}
        onPress={() => setShowList(!showList)}
      >
        <Ionicons name={showList ? "close" : "search"} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default MapScreen;
