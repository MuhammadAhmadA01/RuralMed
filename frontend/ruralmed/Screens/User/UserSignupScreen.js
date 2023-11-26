import React, { useState } from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  View, 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from '../styles/styles';
import MapComponent from '../MapView/MapInputComponent'; 

const Signup = ({ navigation }) => {
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
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };

  const openImageLibrary = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          throw new Error("Sorry, we need camera roll permissions to make this work!");
        }
        return ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
        });
      })
      .then(response => {
        if (!response.canceled) {
          const uri = response.uri;
          const name = new Date().getTime() + "_profile";
          const type = "image/jpeg";
          const newFormData = new FormData();
          newFormData.append("email", email);
          newFormData.append("profile", { name, uri, type });

          setSelectedImage(uri);
          setFormData(newFormData);
        }
      })
      .catch(error => {
        console.error('Error during image selection:', error.message);
        Alert.alert('Error', 'An error occurred during image selection. Please try again.');
      });
  };

  const navigateToLogin = () => {
    // Navigate to the signup screen
    navigation.navigate('login');
  };

  const handleSignup = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !contactNumber ||
      !cityNearBy ||
      !role ||
      !selectedImage ||
      !selectedLocation
    ) {
      Alert.alert("Error", "Fill all fields");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(firstName) || !/^[a-zA-Z]+$/.test(lastName)) {
      Alert.alert("Error", "Names must be alphabetical");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }
    if (!/^\d{11}$/.test(contactNumber)) {
      Alert.alert("Error", "Invalid Contact number");
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
    fetch("http://192.168.0.111:5000/validate-user-data", {
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
          console.log("User data validated successfully");
          
          // Proceed with the rest of your signup logic
          
          navigation.navigate(`${role}`, {
            userData,
            image: formData,
            navigateBack: () => {
              navigation.navigate('signup');
            },
          });
        } else {
          // Handle validation error
          Alert.alert("Error", "Email or Contact number is already in use");
        }
      })
      .catch((error) => {
        console.error("Error during user data validation:", error.message);
        Alert.alert("Error", "Error during user data validation. Please try again.");
      });
  };  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="City Nearby"
          value={cityNearBy}
          onChangeText={setCityNearBy}
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
