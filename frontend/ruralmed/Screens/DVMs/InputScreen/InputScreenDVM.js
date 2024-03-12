import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
  ScrollView,
} from "react-native";
import StorePicker from "../../../Components/Owner/StorePicker";
import { Appbar } from "react-native-paper";
import styles from "./Styles/styles";
import IP_ADDRESS from "../../../config/config";
import TimePicker from "../../../Components/User/TimePicker";
const AddDVMScreen = ({ route, navigation }) => {
  const formData = route.params.image;
  const { userData } = route.params;
  const { email } = route.params.userData;
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const [isDayPicker, setIsDayPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStoreLabel, setSelectedStoreLabel] = useState(
    "Choose Specialization"
  ); // Default placeholder
  const [selectedDayLabel, setSelectedDayLabel] = useState(
    "Choose Non-working Day"
  ); // Default placeholder
  const handleShowPicker = () => {
    setPickerVisible(true);
  };
  const handleStartTimeSelected = (hour, minute, period) => {
    const formattedTime = formatTime(hour, minute, period);
    setSelectedStartTime(formattedTime);
  };

  const handleEndTimeSelected = (hour, minute, period) => {
    const formattedTime = formatTime(hour, minute, period);
    setSelectedEndTime(formattedTime);
  };

  // Function to handle location selection
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };
  const formatTime = (hour, minute, period) => {
    const formattedHour =
      period === "PM" && hour !== "12" ? String(Number(hour) + 12) : hour;
    const formattedTime = `${formattedHour}:${minute}:00`;

    return formattedTime;
  };
  const handleClosePicker = () => {
    setPickerVisible(false);
  };
  const handleDayPickerClose = () => {
    setIsDayPicker(false);
  };

  const handleDayPickerOpen = () => {
    setIsDayPicker(true);
  };
  const [meetingFee, setMeetingFee] = useState("");
  const [experience, setExperience] = useState("");

  const [availability, setAvailability] = useState(true); // Default availability
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [offDay, setOffDay] = useState("");
  const [specializations] = useState([
    "Small Animal Practice",
    "Large Animal Practice",
    "Exotic Animal Medicine",
    "Wildlife Medicine",
    "Emergency and Critical Care",
    "Surgery",
    "Internal Medicine",
    "Diagnostic Imaging",
    "Behavioral Medicine",
    "Equine Medicine and Surgery",
    // Add more specializations as needed
  ]);
  const [days] = useState([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);

  const handleSpecializationChange = (value) => {
    setSelectedSpecialization(value); // Update the selected store label
    setSelectedStoreLabel(value);
  };
  const handleOffDayChange = (value) => {
    setOffDay(value); // Update the selected store label
    setSelectedDayLabel(value);
  };

  const handleSubmit = async () => {
    if (!meetingFee || !selectedSpecialization ||!experience) {
      Alert.alert("Empty fields Error", "Please fill all fields");
      return;
    }

    const numericFee = parseFloat(meetingFee);
    if (isNaN(numericFee) || numericFee > 2000) {
      Alert.alert(
        "Error",
        "Meeting fee must be a numeric value less than or equal to 2000"
      );
      return;
    }
    const numericExperience = parseFloat(experience);

    if (isNaN(numericExperience) || numericExperience > 25 || numericExperience<0) {
      Alert.alert(
        "Error",
        "Experience must be a numeric value less than or equal to 25"
      );
      return;
    }

    const errors = {};
    if (!selectedStartTime) {
      errors.startTime = "Please select a start time.";
    }

    if (!selectedEndTime) {
      errors.endTime = "Please select an end time.";
    }

    if (selectedStartTime && selectedEndTime) {
      const startTime = new Date(`2000-01-01T${selectedStartTime}`);
      const endTime = new Date(`2000-01-01T${selectedEndTime}`);

      const validStartTime = new Date(`2000-01-01T06:00:00`);
      const validEndTime = new Date(`2000-01-01T20:00:00`);

      if (startTime >= endTime) {
        errors.endTime = "End time must be greater than start time.";
      }

      if (!(startTime >= validStartTime && startTime <= validEndTime)) {
        errors.startTime = "Start time must be between 6:00 am to 8:00 pm.";
      }

      if (!(endTime >= validStartTime && endTime <= validEndTime)) {
        errors.endTime = "End time must be between 6:00 am to 8:00 pm.";
      }

      if (startTime >= endTime) {
        errors.endTime = "End time must be greater than start time.";
      }
    }
    const { latitude, longitude } = selectedLocation;
    const locationString = `${longitude},${latitude}`;
    
    setErrorMessages(errors);
    if (Object.keys(errors).length === 0) {
      // First fetch call to signup endpoint
      fetch(`http://${IP_ADDRESS}:5000/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success) {
            // Second fetch call to upload endpoint
            return fetch(`http://${IP_ADDRESS}:5000/upload`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            });
          } else {
            const error = responseData.error || "Unknown error";
            Alert.alert("Error", error);
            route.params.navigateBack();
            throw new Error(error);
          }
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Third fetch call to register-dvm endpoint
            return fetch(`http://${IP_ADDRESS}:5000/register-dvm`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                speciality: selectedSpecialization,
                availability: availability,
                meetingFee: parseFloat(meetingFee),
                email,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                offDay,
                clinicLocation:locationString,
                experience:numericExperience
              }),
            });
          } else {
            Alert.alert("Error", "Registration failed due to image");
            route.params.navigateBack();
            throw new Error("Image upload failed");
          }
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.dvm) {
            Alert.alert("Success", "Use your phone and password to login now");
            navigation.replace("login");
          } else {
            Alert.alert("Error", "Failed to register DVM");
            route.params.navigateBack();
          }
        })
        .catch((error) => {
          Alert.alert("Error", "Registration failed");
          route.params.navigateBack();
          console.error("Error during registration:", error);
        });
    } else {
      // Display validation errors
      let errorMessage = "Please fill in all required fields:\n";
      Object.values(errors).forEach((error) => {
        errorMessage += `- ${error}\n`;
      });
      Alert.alert("Validation Error", errorMessage);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#25d366" />
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Details" />
      </Appbar.Header>
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Provide Additional Details </Text>

        <Text style={styles.label}>Meeting Fee</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter meeting fee (<=2000)"
          keyboardType="numeric"
          value={meetingFee}
          onChangeText={setMeetingFee}
        />
 <Text style={styles.label}>Experience</Text>
        <TextInput
          style={styles.input}
          placeholder="In years (0-25)"
          keyboardType="numeric"
          value={experience}
          onChangeText={setExperience}
        />

        <Text style={styles.label}>Specialization</Text>
        <TouchableOpacity onPress={handleShowPicker} style={styles.input}>
          <Text color="black" marginTop="2" fontSize="20">
            {selectedStoreLabel}
          </Text>
        </TouchableOpacity>

        {isPickerVisible && (
          <StorePicker
            data={specializations.map((specialization) => ({
              label: specialization,
              value: specialization,
            }))}
            selectedValue={selectedSpecialization}
            onSelect={handleSpecializationChange}
            onClose={handleClosePicker}
            navigation={navigation}
          />
        )}
        <Text style={styles.label}>Non Working Day</Text>
        <TouchableOpacity onPress={handleDayPickerOpen} style={styles.input}>
          <Text color="black" marginTop="2" fontSize="20">
            {selectedDayLabel}
          </Text>
        </TouchableOpacity>

        {isDayPicker && (
          <StorePicker
            data={days.map((day) => ({
              label: day,
              value: day,
            }))}
            selectedValue={offDay}
            onSelect={handleOffDayChange}
            onClose={handleDayPickerClose}
            navigation={navigation}
          />
        )}
        <View style={styles.timePickerContainer}>
          <Text style={styles.mapLabel}>Start Time:</Text>
          <TimePicker onTimeSelected={handleStartTimeSelected} />
        </View>
        <View style={styles.timePickerContainer}>
          <Text style={styles.mapLabel}>End Time:</Text>
          <TimePicker onTimeSelected={handleEndTimeSelected} />
        </View>
        <TouchableOpacity style={{marginTop:20}}>
          <Text style={{ fontSize: 18 }}>
            Select clinic location on map:{" "}
            <Text
              onPress={() => {
                navigation.navigate("MapInput", {
                  onSelectLocation: handleLocationSelection,
                });
              }}
              style={styles.signupLink}
            >
              Click here
            </Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.availabilityContainer}>
          <Text style={styles.label}>Availability</Text>
          <Switch
            value={availability}
            onValueChange={(value) => setAvailability(value)}
            thumbColor="#ffffff"
            trackColor={{ true: "#25d366", false: "#d3d3d3" }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </>
  );
};
export default AddDVMScreen;
