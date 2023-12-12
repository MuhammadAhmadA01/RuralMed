// Import necessary dependencies and components
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../Components/OwnerAppHeader";
import IP_ADDRESS from "../../config/config";
import DropDownSelect from "react-native-dropdown-select-list";
import StorePicker from "../../Components/StorePicker";

// Define the AddProductScreen component
const AddProductScreen = ({ navigation }) => {
  // State variables to manage input values, selected store, and error messages
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedStoreLabel, setSelectedStoreLabel] =
    useState("Select a store"); // Default placeholder
  const defaultStoreLabel = "Choose Store";

  const handleShowPicker = () => {
    setPickerVisible(true);
  };

  const handleClosePicker = () => {
    setPickerVisible(false);
  };

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [errors, setErrors] = useState({
    productName: "",
    price: "",
    quantity: "",
    description: "",
    selectedStore: "",
  });

  // Fetch stores from API using store owner's email on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const phone = await AsyncStorage.getItem("phone");
        const emailResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contactNumber: phone,
            }),
          }
        );

        const { email } = await emailResponse.json();

        const storesResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-all-stores/${email}`
        );
        const storesData = await storesResponse.json();

        setStores(storesData.stores);

        if (storesData.stores.length > 0) {
          //   setSelectedStore(storesData.stores[0].storeID);
          //  setSelectedStoreLabel(storesData.stores[0].storeName || defaultStoreLabel);
        } else {
          setSelectedStoreLabel(defaultStoreLabel);
        }

        //    setPickerVisible(true); // Set the picker visible after setting the state
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);
  // Validation functions for each input field
  const validateProductName = () => {
    if (!productName) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productName: "Product Name is required",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, productName: "" }));
    }
  };

  const validatePrice = () => {
    const numericValue = parseFloat(price);
    if (isNaN(numericValue) || numericValue < 50 || numericValue > 5000) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price must be between $50 and $5000",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, price: "" }));
    }
  };

  const validateQuantity = () => {
    const numericValue = parseInt(quantity, 10);
    if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        quantity: "Quantity must be between 1 and 100",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, quantity: "" }));
    }
  };

  const validateDescription = () => {
    if (description.length > 100) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: "Description must be 100 characters or less",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
  };

  const validateSelectedStore = () => {
    if (!selectedStore) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedStore: "Please select a store",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, selectedStore: "" }));
    }
  };

  // Event handlers for input changes
  const handleProductNameChange = (text) => {
    setProductName(text);
  };

  const handlePriceChange = (text) => {
    setPrice(text);
  };

  const handleQuantityChange = (text) => {
    setQuantity(text);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    setCharacterCount(text.length);
  };

  const handleStoreChange = (value, label) => {
    setSelectedStore(value);
    setSelectedStoreLabel(label); // Update the selected store label
  };

  // Handle the Add Product button press
  const handleAddProduct = async () => {
    // Validate fields before making the API call
    validateProductName();
    validatePrice();
    validateQuantity();
    validateDescription();
    validateSelectedStore();

    // Check if any validation errors exist
    if (Object.values(errors).some((error) => error !== "")) {
      Alert.alert("Please fix validation errors before submitting");
      return;
    }

    // Make the API call to add the product
    try {
      const phone = await AsyncStorage.getItem("phone");
      const response = await fetch(`http://${IP_ADDRESS}:5000/add-product/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId: selectedStore,
          name: productName,
          price: parseFloat(price),
          description,
          availableQuantity: parseInt(quantity, 10),
          contactNum: phone,
        }),
      });

      if (response.ok) {
        // Product added successfully
        Alert.alert("Product added successfully");
        navigation.navigate("MyProducts");
      } else {
        // Handle error cases
        Alert.alert("Error adding product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error adding product");
    }
  };

  // Render the component
  return (
    <View style={{ flex: 1 }}>
      <AppHeader navigation={navigation} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>List your Product</Text>

        {/* Product Name input */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={[styles.input, errors.productName ? styles.errorInput : null]}
          placeholder="Enter product name"
          value={productName}
          onChangeText={handleProductNameChange}
          onBlur={validateProductName}
        />
        {errors.productName ? (
          <Text style={styles.errorText}>{errors.productName}</Text>
        ) : null}

        {/* Price input */}
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={[styles.input, errors.price ? styles.errorInput : null]}
          placeholder="Enter price (50-5000)"
          keyboardType="numeric"
          value={price}
          onChangeText={handlePriceChange}
          onBlur={validatePrice}
        />
        {errors.price ? (
          <Text style={styles.errorText}>{errors.price}</Text>
        ) : null}

        {/* Quantity input */}
        <Text style={styles.label}>Quantity (1-100)</Text>
        <TextInput
          style={[styles.input, errors.quantity ? styles.errorInput : null]}
          placeholder="Enter quantity"
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
          onBlur={validateQuantity}
        />
        {errors.quantity ? (
          <Text style={styles.errorText}>{errors.quantity}</Text>
        ) : null}

        {/* Description input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, errors.description ? styles.errorInput : null]}
          placeholder="Enter description (max 100 characters)"
          multiline
          value={description}
          onChangeText={handleDescriptionChange}
          onBlur={validateDescription}
        />
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}
        <Text style={styles.characterCount}>{characterCount}/100</Text>

        {/* Select Store dropdown */}
        <Text style={styles.label}>Select Store</Text>
        <TouchableOpacity onPress={handleShowPicker} style={styles.input}>
          <Text color="black" marginTop="2" fontSize="20">
            {selectedStoreLabel}
          </Text>
        </TouchableOpacity>
        {/* Custom Picker */}
        {isPickerVisible && (
          <StorePicker
            data={stores.map((store) => ({
              label: store.storeName,
              value: store.storeID,
            }))}
            selectedValue={selectedStore}
            onSelect={handleStoreChange}
            onClose={handleClosePicker}
          />
        )}
        {errors.selectedStore ? (
          <Text style={styles.errorText}>{errors.selectedStore}</Text>
        ) : null}

        {/* Add Product button */}
        <TouchableOpacity onPress={handleAddProduct} style={styles.addButton}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: windowHeight * 0.05,
    borderColor: "#25d366",
    borderWidth: 1,
    marginBottom: "3%",
    paddingHorizontal: "3%",
    borderRadius: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  characterCount: {
    textAlign: "right",
    color: "gray",
  },
  pickerButton: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#25d366",
    borderRadius: 10,
    paddingVertical: "2%", // Use percentage for padding
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
  },
  buttonText: {
    color: "white",
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
  },
});

// Export the component
export default AddProductScreen;
