import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../styles/styles";
import IP_ADDRESS from "../../../config/config";
const CustomerScreen = ({ route, navigation }) => {
  const { email } = route.params.userData;
  const formData = route.params.image;
  const { userData } = route.params;
  const [cnic, setCnic] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");

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

    fetch(`http://${IP_ADDRESS}:5000/customer-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, cnic, deliveryFee: parsedDeliveryFee }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          // Handle success
          Alert.alert(
            "Success",
            "Customer details saved successfully, Waiting for uploading image"
          );
        } else {
          // Handle failure
          Alert.alert("Error", responseData.error || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error.message);
        Alert.alert("Error", "Error submitting data. Please try again.");
        return;
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
          return;
        }
      })
      .catch((error) => {
        console.error("Error during user registration:", error.message);
        Alert.alert("Error, Registration Error");
        route.params.navigateBack();
        return;
      })
      .then(() => {
        return fetch(`http://${IP_ADDRESS}:5000/upload`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "multipart/form-data",
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
          return;
        }
      })
      .catch((error) => {
        Alert.alert("Error uploading image:", error.message);
        route.params.navigateBack();

        return;
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Details</Text>
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
      <TouchableOpacity style={styles.signupButton} onPress={handleSave}>
        <Text style={styles.signupButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerScreen;
