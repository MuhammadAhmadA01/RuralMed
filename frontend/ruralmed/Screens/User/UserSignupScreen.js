import IP_ADDRESS from "../../config/config";
import React, { useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/styles";
import MapComponent from "../MapView/MapInputComponent";
import { Appbar } from "react-native-paper";

// Functional component 'Signup'
const Signup = ({ navigation }) => {
  // State variables to manage form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [cityNearBy, setCityNearBy] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState(null);

  // Error state variables for each input field
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [contactNumberError, setContactNumberError] = useState(null);
  const [cityNearByError, setCityNearByError] = useState(null);
  const [roleError, setRoleError] = useState(null);

  // Function to handle location selection
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };

  // Function to open image library
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
          const uri = response.uri;
          const name = new Date().getTime() + "_profile";
          const type = "image/jpg";
          const newFormData = new FormData();
          newFormData.append("email", email);
          newFormData.append("profile", { name, uri, type });

          setSelectedImage(uri);
          setFormData(newFormData);
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

  // Function to navigate to login screen
  const navigateToLogin = () => {
    navigation.replace("login");
  };
  const handleSignup = () => {
    // Clear previous error messages
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setContactNumberError(null);
    setCityNearByError(null);
    setRoleError(null);

    // Validation for empty or invalid data
    if (!firstName || !/^[a-zA-Z]+$/.test(firstName)) {
      setFirstNameError("First name must be alphabetical");
    }

    if (!lastName || !/^[a-zA-Z]+$/.test(lastName)) {
      setLastNameError("Last name must be alphabetical");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
    }

    if (!password) {
      setPasswordError("Password is required");
    }

    if (!contactNumber || !/^\d{11}$/.test(contactNumber)) {
      setContactNumberError("Invalid contact number");
    }

    if (!cityNearBy) {
      setCityNearByError("City nearby is required");
    }

    if (!role) {
      setRoleError("Role is required");
    }

    // Check if there are any errors
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      contactNumberError ||
      cityNearByError ||
      roleError
    ) {
      // If there are errors, display an alert or handle them accordingly
      Alert.alert("Error", "Please fix the errors before proceeding");
      return;
    }

    const { latitude, longitude } = selectedLocation;
    const locationString = `${longitude},${latitude}`;
    const userData = {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      cityNearBy,
      role,
      picture: null,
      address: locationString,
    };
    fetch(`http://${IP_ADDRESS}:5000/validate-user-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, contactNumber }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          // If validation is successful, proceed with signup
         
          // Proceed with the rest of your signup logic
          navigation.navigate(`${role}`, {
            userData,
            image: formData,
            navigateBack: () => {
              navigation.navigate("signup");
            },
          });
        } else {
          // Handle validation error
          Alert.alert("Error", "Email or Contact number is already in use");
        }
      })
      .catch((error) => {
        console.error("Error during user data validation:", error.message);
        Alert.alert(
          "Error",
          "Error during user data validation. Please try again."
        );
      });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Sign Up</Text>

      {/* Error message */}
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {/* Input container */}
      <View style={styles.inputContainer}>
        {/* First Name */}
        {firstNameError && <Text style={styles.error}>{firstNameError}</Text>}

        <TextInput
          style={[
            styles.input,
            firstNameError && styles.inputError, // Highlight border red on error
          ]}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          onBlur={() =>
            setFirstNameError(!firstName ? "First name is required" : null)
          }
        />
        {lastNameError && <Text style={styles.error}>{lastNameError}</Text>}

        <TextInput
          style={[styles.input, lastNameError && styles.inputError]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          onBlur={() =>
            setLastNameError(!lastName ? "Last name is required" : null)
          }
        />
        {emailError && <Text style={styles.error}>{emailError}</Text>}

        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email (include @)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onBlur={() => setEmailError(!email ? "Email is required" : null)}
        />
        {passwordError && <Text style={styles.error}>{passwordError}</Text>}

        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Password (alphanumeric of min 6-char)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onBlur={() =>
            setPasswordError(!password ? "Password is required" : null)
          }
        />
        {contactNumberError && (
          <Text style={styles.error}>{contactNumberError}</Text>
        )}

        <TextInput
          style={[styles.input, contactNumberError && styles.inputError]}
          placeholder="Contact Number (eg 03211234567)"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          onBlur={() =>
            setContactNumberError(
              !contactNumber ? "Contact number is required" : null
            )
          }
        />
        {cityNearByError && <Text style={styles.error}>{cityNearByError}</Text>}

        <TextInput
          style={[styles.input, cityNearByError && styles.inputError]}
          placeholder="City Nearby"
          value={cityNearBy}
          onChangeText={setCityNearBy}
          onBlur={() =>
            setCityNearByError(!cityNearBy ? "City nearby is required" : null)
          }
        />

        <MapComponent onSelectLocation={handleLocationSelection} />

        <View style={styles.uploadContainer}>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadBtnContainer}
          >
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.uploadedImg}
              />
            ) : (
              <Text style={styles.uploadBtn}>Upload Profile Image</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>Select Role:</Text>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "Customer" && styles.selectedRole,
            ]}
            onPress={() => setRole("Customer")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "Customer" && styles.selectedRoleText,
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === "Rider" && styles.selectedRole]}
            onPress={() => setRole("Rider")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "Rider" && styles.selectedRoleText,
              ]}
            >
              Rider
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === "Owner" && styles.selectedRole]}
            onPress={() => setRole("Owner")}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === "Owner" && styles.selectedRoleText,
              ]}
            >
              Owner
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Next</Text>
      </TouchableOpacity>
      <View style={styles.signupLinkContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.signupLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;
