import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { styles } from "../styles/styles";
import IP_ADDRESS from "../../config/config";
const OwnerScreen = ({ route,navigation }) => {
  const { email } = route.params.userData;
  const  formData  = route.params.image;
  const { userData } = route.params;
  const [cnic, setCnic] = useState("");
  const handleSave = () => {
    // Validate CNIC
    if (!/^\d{13}$/.test(cnic)) {
      Alert.alert("Error", "CNIC must be 13 digits and numeric only");
      return;
    }

    fetch(`http://${IP_ADDRESS}:5000/owner-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, cnic}),
      })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
          // Handle success
          Alert.alert("Success", "Owner details saved successfully, Waiting for uploading image");
        } else {
          // Handle failure
          Alert.alert("Error", responseData.error || "Unknown errorr in owner");
          if (responseData.error === "email is already in use") {
            route.params.navigateBack();
            return;
          }
        }
      })
      .catch(error => {
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
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success) {
        } else {
          const error = responseData.error || "Unknown error";
          Alert.alert("Error", error);
          route.params.navigateBack();
          return;
        }
      })
      .catch(error => {
        Alert.alert("Error, Registration Error");
        //route.params.navigateBack();
        return;
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
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Alert.alert("Success", "Use your email and password to login now");
           navigation.navigate('login')
        } else {
          Alert.alert("Error", "Registration failed due to image");
          //navigation.navigate('login')
       
          route.params.navigateBack();
          return;
        }
      })
      .catch(error => {
        route.params.navigateBack();
        return;
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add your CNIC</Text>
      <TextInput
        style={styles.input}
        placeholder="CNIC"
        value={cnic}
        onChangeText={setCnic}
        keyboardType="numeric"
      />
        <TouchableOpacity style={styles.signupButton} onPress={handleSave}>
        <Text style={styles.signupButtonText}>Save</Text>
      </TouchableOpacity>

  </View>
  );
}
export default OwnerScreen;
      