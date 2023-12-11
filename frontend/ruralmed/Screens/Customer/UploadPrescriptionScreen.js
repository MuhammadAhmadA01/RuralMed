import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Switch
} from "react-native";
import { Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import IP_ADDRESS from "../../config/config";
import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UploadPrescriptionScreen = ({ navigation, route }) => {
  const [durationError, setDurationError] = useState(null); // New state for duration error
  const [loading, setLoading] = useState(false); // State for controlling the loader
  const [switchOn, setSwitchOn] = useState(false); // Added switch state

  const { email, store, contactNumberCustomer } = route.params;
  console.log(store);
  const [selectedImage, setSelectedImage] = useState(null);
  const [duration, setDuration] = useState("");
  useEffect(() => {
    setSelectedImage("");
    setDuration("");
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
          allowsEditing: true,
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

        console.log("Text extraction response:", data);

        // Check for specific words in the response
        const foundWords = data.filter(
          (item) =>
            (prescription_keywords = [
              "doctor",
              "hospital",
              "dr",
              "court",
              "medicine",
              "med",
              "medical",
              "medicare",
              "clinic",
              "Rx",
              "tab",
              "prescription",
              "dosage",
              "pharmacy",
              "dosage",
              "dispense",
              "directions",
              "pharmacist",
              "diagnosis",
              "compounded",
              "refill",
              "dispense as written",
              "patient",
              "dose",
              "sig",
              "disp",
              "ref",
              "medication",
              "prescribe",
              "compounding",
              "pharmaceutical",
              "adverse reaction",
              "side effects",
              "contraindications",
              "over-the-counter",
              "generic",
              "brand name",
              "capsule",
              "tablet",
              "pill",
              "liquid",
              "inhaler",
              "ointment",
              "cream",
              "gel",
              "solution",
              "syrup",
              "drop",
              "ampule",
              "vial",
              "suppository",
              "intravenous",
              "intramuscular",
              "subcutaneous",
              "PRN",
              "bid",
              "tid",
              "qid",
              "qhs",
              "q4h",
              "q6h",
              "q8h",
              "q12h",
              "q24h",
              "before meals",
              "after meals",
              "with food",
              "without food",
              "as directed",
            ].includes(item.text.toLowerCase()))
        );

        if (foundWords.length > 0) {
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
              console.log(data)
              // Handle the response data as needed
              console.log("Upload response:", data);
              setLoading(false);
              navigation.navigate("PrescriptionPlaceOrderScreen", {
                contactNumber: contactNumberCustomer,
                store,
                prescriptionLink: data.link,
                switchOn

              });
              //  Alert.alert('Uploaded success')
            })
            .catch((error) => {
              console.error("Error during image upload:", error);
            });
          // Continue with the order placement logic...
        } else {
          console.log("Not a valid prescription.");
          Alert.alert(
            "Error",
            "No prescription-related words found in the image."
          );
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
    <View style={styles.container}>
       {/* Image Instructions Section */}
    
      
      <Title style={styles.title}>Upload your Prescription</Title>
      <View style={styles.instructionsContainer}>
        <Title style={styles.instructionsTitle}>Instructions</Title>
        <Text style={styles.instructionsText}>
          - Prescription must have clinic/hospital name {"\n"}  printed on it {"\n"}
          - Must not contain your personal information {"\n"}
          - Do not upload any handwritten medicines only.{"\n"}
          - You can hide your identity as well
        </Text>
      </View>

      <TouchableOpacity style={{ color: "#25d366" }} onPress={openImageLibrary}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Text style={{ color: "#25d366", marginTop:20 }}>Click here to Select Image</Text>
          )}
        </View>
      </TouchableOpacity>
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
 <View style={styles.switchContainer}>
          <Text>Hide Identity</Text>
          <Switch
            value={switchOn}
            onValueChange={() => setSwitchOn(!switchOn)}
            trackColor={{ false: "#767577", true: "#25d366" }}
            thumbColor={switchOn ? "#25d366" : "#f4f3f4"}
          />
        </View>

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
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    textAlign: "left",
    fontSize: 12,
    marginTop: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    width: 200,
    borderRadius: 5,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24, // Adjust the font size as needed
    fontWeight: "bold", // Use 'bold' for a bolder weight
    marginBottom: 20, // Adjust the margin as needed
  },
  button: {
    backgroundColor: "#25d366",
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  signupButton: {
    backgroundColor: "#25d366",
    borderRadius: 10,
    paddingVertical: "2%", // Use percentage for padding
    paddingHorizontal: "25%", // Use percentage for padding

    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: 200,
  },
  identityText: {
    color: "#333", // Adjust the color as needed
    marginBottom: 20,
  },
  instructionsContainer: {
    marginTop: 0,
    paddingHorizontal: 20,
  },
  instructionsTitle: {
    color: "#25d366",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    color: "#333",
  },
});

export default UploadPrescriptionScreen;
