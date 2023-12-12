// RiderScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import MapComponent from "../MapView/MapInputComponent";
import { styles } from "../styles/styles";
import IP_ADDRESS from "../../config/config";
const RiderScreen = ({ route, navigation }) => {
  const { email } = route.params.userData;
  const formData = route.params.image;
  const { userData } = route.params;
  const [cnic, setCnic] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [workingArea, setWorkingArea] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const handleSave = () => {
    // Validate CNIC
    if (!/^\d{13}$/.test(cnic)) {
      Alert.alert("Error", "CNIC must be 13 digits and numeric only");
      return;
    }

    // Validate Delivery Fee
    const parsedDeliveryFee = parseInt(deliveryFee, 10);
    if (
      isNaN(parsedDeliveryFee) ||
      parsedDeliveryFee < 100 ||
      parsedDeliveryFee > 1000
    ) {
      Alert.alert(
        "Error",
        "Delivery fee must be a number between 100 and 1000"
      );
      return;
    }

    // Validate Working Area
    if (!workingArea) {
      Alert.alert("Error", "Please select a working area on the map");
      return;
    }
    const { latitude, longitude } = workingArea;
    const locationString = `${longitude},${latitude}`;

    const requestBody = {
      email,
      cnic,
      deliveryFee: parsedDeliveryFee,
      workingArea: locationString,
      availabilityStatus: isOnline ? "Online" : "Offline",
    };

    fetch(`http://${IP_ADDRESS}:5000/create-rider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          Alert.alert(
            "Success",
            "Rider details saved successfully, Waiting for uploading image"
          );
          navigation.replace("login");
        } else {
          Alert.alert("Error", responseData.error || "Unknown error");
          if (responseData.error === "email is already in use") {
            route.params.navigateBack();
            return;
          }
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error.message);
        Alert.alert("Error", "Error submitting data. Please try again.");
      })
      .then(() => {
        return fetch(`http://${IP_ADDRESS}:5000/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
        } else {
          const error = responseData.error || "Unknown error";
          Alert.alert("Error", error);
          route.params.navigateBack();
        }
      })
      .catch((error) => {
        console.error("Error during user registration:", error.message);
        Alert.alert("Error, Registration Error");
        route.params.navigateBack();
      })
      .then(() => {
        return fetch(`http://${IP_ADDRESS}:5000/upload`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Use your email and password to login now");
          navigation.replace("login");
        } else {
          Alert.alert("Error", "Registration failed due to image");
          route.params.navigateBack();
        }
      })
      .catch((error) => {
        route.params.navigateBack();
      });
  };

  const handleLocationSelection = (coordinates) => {
    setWorkingArea(coordinates);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Details</Text>
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        value={cnic}
        onChangeText={setCnic}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Fee"
        value={deliveryFee}
        onChangeText={setDeliveryFee}
        keyboardType="numeric"
      />
      <MapComponent onSelectLocation={handleLocationSelection} />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Availability</Text>
        <Switch
          value={isOnline}
          onValueChange={(value) => setIsOnline(value)}
          thumbColor={isOnline ? "#4CAF50" : "#9E9E9E"}
        />
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSave}>
        <Text style={styles.signupButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RiderScreen;
