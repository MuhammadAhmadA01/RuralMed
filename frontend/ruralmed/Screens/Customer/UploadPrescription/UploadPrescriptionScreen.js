import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
  StatusBar,
} from "react-native";
import styles from "./styles/styles";
import { Title, Appbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import IP_ADDRESS from "../../../config/config";

const UploadPrescriptionScreen = ({ route, navigation }) => {
  const [durationError, setDurationError] = useState(null); // New state for duration error
  const [loading, setLoading] = useState(false); // State for controlling the loader
  const [switchOn, setSwitchOn] = useState(false); // Added switch state

  const { email, store, contactNumberCustomer } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  const [duration, setDuration] = useState("");
  useEffect(() => {
    setSelectedImage("");
    setDuration("");
    setSwitchOn(false);
  }, []);
  const openImageLibrary = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          throw new Error(
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
        return ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
         
        });
      })
      .then((response) => {
        if (!response.canceled) {
          setSelectedImage(response.uri);
        }
      })
      .catch((error) => {
        console.error("Error during image selection:", error.message);
        Alert.alert(
          "Error",
          "An error occurred during image selection. Please try again."
        );
      });
  };

  const handleCheckout = () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image before placing the order.");
      return;
    }

    if (!duration || isNaN(duration) || duration < 1 || duration > 30) {
      setDurationError("Please enter a valid duration between 1 and 30 days.");
      return;
    } else {
      setDurationError(null);
    }
    setLoading(true);
    // Use the text extraction API
    const apiKey = "voLMDc1Disq5hRxNkhcHGg==5cat5sdYb3qGjkDV";
    const apiUrl = "https://api.api-ninjas.com/v1/imagetotext";

    const name = new Date().getTime() + "_prescription";
    const type = "image/jpeg";
    const formData = new FormData();
    formData.append("image", { name, uri: selectedImage, type });
    // console.log(formData)
    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "multipart/form-data",
        "X-Api-Key": apiKey,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        const extractedText = data
          .map((item) => item.text.toLowerCase())
          .join(" ");
        console.log(extractedText);
        
        console.log(extractedText);
        if((extractedText.includes('hospital')||extractedText.includes('clinic')||extractedText.includes('medicare')||extractedText.includes('medical complex')||extractedText.includes('doctor')||extractedText.includes('dr'))
         && (extractedText.includes('tab')||extractedText.includes('dose')|| extractedText.includes('syrup') ||extractedText.includes('ph')||extractedText.includes('rx')|| extractedText.includes('consultant') || extractedText.includes('general') || extractedText.includes('mbbs') || extractedText.includes('clinical') )
         && (extractedText.includes('date') || extractedText.includes('age'))
         )
        {
          const name = new Date().getTime() + "_prescription";
          const type = "image/jpg";
          const formData = new FormData();
          formData.append("profile", { name, uri: selectedImage, type });
          formData.append("email", email);
          formData.append("duration", duration);

          console.log(formData);

          fetch(`http://${IP_ADDRESS}:5000/upload-pres`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "multipart/form-data",
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              
              // Handle the response data as needed
              setLoading(false);
              navigation.navigate("PrescriptionPlaceOrderScreen", {
                contactNumber: contactNumberCustomer,
                store,
                prescriptionLink: data.link,
                switchOn,
              });
              //  Alert.alert('Uploaded success')
            })
            .catch((error) => {
              console.error("Error during image upload:", error);
            });
          // Continue with the order placement logic...
        } else {
          Alert.alert("Error", "Invalid Prescription");
          setLoading(false);
          return;
        }
      })
      .catch((error) => {
        console.error("Error during text extraction:", error);
        Alert.alert(
          "Error",
          "An error occurred during text extraction. Please try again."
        );
      });
  };

  return (
    <>
      <StatusBar backgroundColor="#25d366"></StatusBar>
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Upload Prescription" />
      </Appbar.Header>

      <View style={styles.container}>
        {/* Image Instructions Section */}

        <Title style={styles.title}>Upload your Prescription</Title>
        <View style={styles.instructionsContainer}>
          <Title style={styles.instructionsTitle}>Instructions</Title>
          <Text style={styles.instructionsText}>
            - Prescription must have clinic/hospital name {"\n"} printed on it{" "}
            {"\n"}- Must not contain your personal information {"\n"}- Do not
            upload any handwritten medicines only.{"\n"}- You can hide your
            identity as well
          </Text>
        </View>

        <TouchableOpacity
          style={{ color: "#25d366" }}
          onPress={openImageLibrary}
        >
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <Text style={{ color: "#25d366", marginTop: 20 }}>
                Click here to Select Image
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text>Hide Identity</Text>
          <Switch
            value={switchOn}
            onValueChange={() => {
              setSwitchOn(!switchOn);
            }}
            trackColor={{ false: "#767577", true: "#25d366" }}
            thumbColor={switchOn ? "#25d366" : "#f4f3f4"}
          />
        </View>
        {durationError && <Text style={styles.errorText}>{durationError}</Text>}

        <TextInput
          placeholder="Duration (days) 1-30"
          keyboardType="numeric"
          style={[
            styles.input,
            durationError && { borderColor: "red" }, // Highlight border red on error
          ]}
          value={duration}
          onChangeText={(text) => {
            setDuration(text);
            setDurationError(null); // Clear error when user types
          }}
          onBlur={() => {
            // Validate and set error when user focuses off the field
            if (!duration || isNaN(duration) || duration < 1 || duration > 30) {
              setDurationError(
                "Please enter a valid duration between 1 and 30 days."
              );
            }
          }}
        />

        <TouchableOpacity onPress={handleCheckout} style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Checkout</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#25d366" />
            <Text style={{ marginTop: 10 }}>Validating Prescription...</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default UploadPrescriptionScreen;
