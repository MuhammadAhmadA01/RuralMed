import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import IP_ADDRESS from "../../config/config";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {  Title, RadioButton } from "react-native-paper";
import MapComponent from "../MapView/MapInputComponent";
import TimePicker from "../../Components/TimePicker";
import { styles } from "../styles/styles";
import AppHeader from "../../Components/OwnerAppHeader";
const StoreScreen = ({ navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [storeContact, setStoreContact] = useState("");
  const [storeType, setStoreType] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [storeAvailability, setStoreAvailability] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [email,setOwnerEmail]=useState('');  
  const[contactNumAsync,setContactNumAsync]=useState('')
  useEffect(()=>{
    AsyncStorage.getItem('phone').then((phoneNumber) => {
      setContactNumAsync(phoneNumber)
    
      // Now you can use contactNum here or within the callback
      }).catch((error) => {
      console.error('Error fetching contact number:', error);
    });


  },[])
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };

  const handleStartTimeSelected = (hour, minute, period) => {
    const formattedTime = formatTime(hour, minute, period);
    setSelectedStartTime(formattedTime);
  };

  const handleEndTimeSelected = (hour, minute, period) => {
    const formattedTime = formatTime(hour, minute, period);
    setSelectedEndTime(formattedTime);
  };

  const formatTime = (hour, minute, period) => {
    const formattedHour =
      period === "PM" && hour !== "12" ? String(Number(hour) + 12) : hour;
    const formattedTime = `${formattedHour}:${minute}:00`;

    return formattedTime;
  };
const validateField = (fieldName, value, regex) => {
    const errors = { ...errorMessages };

    if (!value.trim() || !regex.test(value)) {
      errors[fieldName] = `Invalid ${fieldName}`;
    } else {
      delete errors[fieldName];
    }

    setErrorMessages(errors);
  };
  const handleCreateStore = () => {
    const errors = {};

    validateField("storeName", storeName, /^[a-zA-Z0-9 ]+/);
    validateField("storeContact", storeContact, /^\d{11}$/);
    if (!storeName) errors.storeName = "Please mention store name.";

    if (!storeContact) errors.storeContact = "Please enter store's contact.";
    // Validate storeType
    if (!storeType) {
      errors.storeType = "Please select a store type.";
    }
    if (!storeAvailability) {
      errors.storeAvailability = "Please Choose availability.";
    }

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
    if (!selectedLocation) {
      errors.location = "Please select a location on the map.";
    }

    setErrorMessages(errors);
    if (Object.keys(errors).length === 0) {
        // No errors, proceed with API calls
        // Fetching email based on contact number
        fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactNumber:contactNumAsync 
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.email) {
              // Email obtained, proceed with the second API call
              setOwnerEmail(data.email)
              console.log("aimmi")
              console.log(email)
              const lat=selectedLocation.latitude;
              const long=selectedLocation.longitude;
             
    
              fetch(`http://${IP_ADDRESS}:5000/add-store`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ownerEmail:data.email,
                  storeName,
                  store_address: `${long},${lat}`,
                  storeContact,
                  storeType,
                  startTime: selectedStartTime,
                  endTime: selectedEndTime,
                  availability: storeAvailability,
                }),
              })
                .then((response) => response.json())
                .then((result) => {
                  console.log(result)
                    if(result.success)
                    {
                      Alert.alert('Success', 'Store created successfully');
                  navigation.navigate('HomeOwner');
                    }
                    else{
                        console.log("error in creating store", result.errors)
                    }
                })
                .catch((error) => {
                  console.error('Error creating store:', error);
                  Alert.alert('Error', 'Failed to create store. Please try again.');
                });
            } else {
              // No email found for the given contact number
              Alert.alert('Error', 'No user found with the provided contact number.');
            }
          })
          .catch((error) => {
            console.error('Error fetching email by contactNumber:', error);
            Alert.alert('Error', 'Failed to fetch email. Please try again.');
          });
      } else {
        // Display validation errors
        let errorMessage = 'Please fill in all required fields:\n';
        Object.values(errors).forEach((error) => {
          errorMessage += `- ${error}\n`;
        });
        Alert.alert('Validation Error', errorMessage);
      }
    };
  return (
    <View style={{ flex: 1 }}>
<AppHeader
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={{ textAlign: "center" }}>Create The store</Title>
        {errorMessages.storeName && (
          <Text style={stylesError.errorMessage}>
            {errorMessages.storeName}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            errorMessages.storeName && stylesError.errorInput,
          ]}
          placeholder="Store Name"
          value={storeName}
          onChangeText={(text) => setStoreName(text)}
          onBlur={() => validateField("storeName", storeName, /^[a-zA-Z0-9 ]+/)}
          marginTop={15}
        />
        {errorMessages.storeContact && (
          <Text style={stylesError.errorMessage}>
            {errorMessages.storeContact}
          </Text>
        )}
        <TextInput
          style={[
            styles.input,
            errorMessages.storeContact && stylesError.errorInput,
          ]}
          placeholder="Store Contact (e.g., 03123456789)"
          keyboardType="numeric"
          value={storeContact}
          onChangeText={(text) => setStoreContact(text)}
          onBlur={() => validateField("storeContact", storeContact, /^\d{11}$/)}
        />
        <View style={styles.timePickerContainer}>
          <Text style={styles.mapLabel}>Start Time:</Text>
          <TimePicker onTimeSelected={handleStartTimeSelected} />
        </View>
        <View style={styles.timePickerContainer}>
          <Text style={styles.mapLabel}>End Time:</Text>
          <TimePicker onTimeSelected={handleEndTimeSelected} />
        </View>
        <MapComponent onSelectLocation={handleLocationSelection} />
        <RadioButton.Group
          onValueChange={(value) => setStoreType(value)}
          value={storeType}
        >
          <View style={styles.radioContainer}>
            <Text style={styles.mapLabel}>Store Type:</Text>
            <RadioButton.Item label="Pharmacy" value="Pharmacy" />
            <RadioButton.Item label="Agricultural" value="Agricultural" />
            <RadioButton.Item label="Veteran" value="Veteran" />
          </View>
        </RadioButton.Group>
        <RadioButton.Group
          onValueChange={(value) => setStoreAvailability(value)}
          value={storeAvailability}
        >
          <View style={styles.radioContainer}>
            <Text style={styles.mapLabel}>Store Availability:</Text>
            <RadioButton.Item label="Online" value="Online" />
            <RadioButton.Item label="Offline" value="Offline" />
          </View>
        </RadioButton.Group>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleCreateStore}
        >
          <Text style={styles.signupButtonText}>Create Store</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const stylesError = StyleSheet.create({
  errorInput: {
    borderColor: "red",
  },
  errorMessage: {
    color: "red",
  },
});

export default StoreScreen;
