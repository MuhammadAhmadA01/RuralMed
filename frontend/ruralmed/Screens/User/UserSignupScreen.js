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
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/styles";
import OTPModal from "../../Components/User/OtpModal";
import { Appbar } from "react-native-paper";
const Signup = ({ navigation }) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [cityNearBy, setCityNearBy] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false); // New state to track email verification
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [contactNumberError, setContactNumberError] = useState(null);
  const [cityNearByError, setCityNearByError] = useState(null);
  const [roleError, setRoleError] = useState(null);
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };
  const closeOTPModal = () => {
    setShowOtpModal(false);
  };
  const openImageLibrary = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted")
          throw new Error(
            "Sorry, we need camera roll permissions to make this work!"
          );
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
  const navigateToLogin = () => {
    navigation.replace("login");
  };
  const handleSendOTP = () => {
    setShowOtpModal(true);
    fetch(`http://${IP_ADDRESS}:5000/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (responseData.success) {
          setShowOtpModal(true);
          setOtp(responseData.otp);
        } else Alert.alert("Error", responseData.message);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error.message);
        Alert.alert(
          "Error",
          "An error occurred while sending OTP. Please try again."
        );
      });
  };
  const handleVerifyOTP = (otp, genOtp) => {
    fetch(`http://${IP_ADDRESS}:5000/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otp, userEnteredOTP: genOtp }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (responseData.success) {
          closeOTPModal();
          setEmailVerified(!emailVerified);
          Alert.alert("Success", "Email verified successfully");
        } else Alert.alert("Error", "Invalid OTP. Please try again.");
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error.message);
        Alert.alert(
          "Error",
          "An error occurred while verifying OTP. Please try again."
        );
      });
  };
  const handleSignup = () => {
    if (!emailVerified) {
      Alert.alert("Verify your email first");
      return;
    }
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setContactNumberError(null);
    setCityNearByError(null);
    setRoleError(null);
    if (!firstName || !/^[a-zA-Z]+$/.test(firstName))
      setFirstNameError("First name must be alphabetical");
    if (!lastName || !/^[a-zA-Z]+$/.test(lastName))
      setLastNameError("Last name must be alphabetical");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      setEmailError("Invalid email format");
    if (!password) setPasswordError("Password is required");
    if (!contactNumber || !/^\d{11}$/.test(contactNumber))
      setContactNumberError("Invalid contact number");
    if (!cityNearBy) setCityNearByError("City nearby is required");
    if (!role) setRoleError("Role is required");
    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      passwordError ||
      contactNumberError ||
      cityNearByError ||
      roleError
    ) {
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
          navigation.navigate(`${role}`, {
            userData,
            image: formData,
            navigateBack: () => {
              navigation.navigate("signup");
            },
          });
        } else
          Alert.alert("Error", "Email or Contact number is already in use");
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
    <>
      <StatusBar backgroundColor="#25d366"></StatusBar>
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Text style={{ fontSize: 25, fontWeight: "600", marginLeft: 135 }}>
          RuralMed
        </Text>
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Fill the Details</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <View style={styles.inputContainer}>
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
          <View style={{ position: "relative" }}>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="Email (include @)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onBlur={() => setEmailError(!email ? "Email is required" : null)}
              editable={!emailVerified}
            />
            {email && !emailError && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                  height: "100%",
                  justifyContent: "center",
                  bottom: 5,
                }}
                disabled={emailVerified}
                onPress={() => {
                  setShowOtpModal(true);
                  handleSendOTP();
                }}
              >
                <Text
                  style={{
                    color: emailVerified ? "gray" : "#25d366",
                    marginBottom: 9,
                  }}
                >
                  {emailVerified ? "Verified" : "Verify Email"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
          {cityNearByError && (
            <Text style={styles.error}>{cityNearByError}</Text>
          )}
          <TextInput
            style={[styles.input, cityNearByError && styles.inputError]}
            placeholder="City Nearby"
            value={cityNearBy}
            onChangeText={setCityNearBy}
            onBlur={() =>
              setCityNearByError(!cityNearBy ? "City nearby is required" : null)
            }
          />
          <TouchableOpacity>
            <Text style={{ fontSize: 16 }}>
              Select Home location on map:{" "}
              <Text
                onPress={() => {
                  navigation.navigate("MapInput", {
                    onSelectLocation: handleLocationSelection,
                  });
                  console.log(selectedLocation);
                }}
                style={[
                  styles.signupLink,
                  {
                    fontSize: 20,
                    marginLeft: "10px",
                    textDecorationLine: "underline",
                    color: "#25d366",
                  },
                ]}
              >
                Click here
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={[styles.uploadContainer, { marginTop: "2%" }]}>
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
              style={[
                styles.roleButton,
                role === "Rider" && styles.selectedRole,
              ]}
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
              style={[
                styles.roleButton,
                role === "Owner" && styles.selectedRole,
              ]}
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
            <TouchableOpacity
              style={[styles.roleButton, role === "DVM" && styles.selectedRole]}
              onPress={() => setRole("DVM")}
            >
              <Text
                style={[
                  styles.roleButtonText,
                  role === "DVM" && styles.selectedRoleText,
                ]}
              >
                DVM
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
          <OTPModal
            visible={showOtpModal}
            onSubmit={handleVerifyOTP}
            onClose={closeOTPModal}
            generatedOtp={otp}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default Signup;
