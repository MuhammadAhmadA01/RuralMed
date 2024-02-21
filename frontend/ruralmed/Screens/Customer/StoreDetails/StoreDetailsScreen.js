import IP_ADDRESS from "../../../config/config";
import styles from "./styles/styles";
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Appbar, Badge } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../Components/Cart/CartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the StoreDetailsScreen component
const StoreDetailsScreen = ({ route, navigation }) => {
  const { store, products, contactNum } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  // State to manage the visibility of the "View Cart" button
  const [showViewCartButton, setShowViewCartButton] = useState(false);

  // Function to handle adding/removing items from the cart

  // Effect to update the visibility of the "View Cart" button
  useEffect(() => {
    setShowViewCartButton(cartItems.length > 0);
  }, [cartItems]);

  const handleAddToCart = async (product) => {
    const existingItem = cartItems.find(
      (item) => item.productID === product.productID
    );
    // Define the API endpoint
    if (!existingItem) {
      const sameStoreCheck = cartItems.find(
        (item) => item.storeId === product.storeId
      );
      if (sameStoreCheck || !cartItems.length) {
        const apiEndpoint = `http://${IP_ADDRESS}:5000/add-to-cart`;
        const phoneNum = await AsyncStorage.getItem("phone");

        try {
          // Make API call
          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerContact: phoneNum,
              product,
            }),
          });

          if (response.ok) {
            // If the API call is successful, dispatch the action to update the Redux store
            dispatch(addToCart(product));
          } else if (response.status === 404) {
            Alert.alert(
              "Limit Exceeds",
              "Your Quantity exceeds from available quantity"
            );
            return;
          }
        } catch (error) {
          console.error(
            "Add to cart API call failed with an exception:",
            error
          );
        }
      } else {
        Alert.alert("Choose from Same Store","Cannot add products in cart from different stores");
        return;
      }
    } else {
      const apiEndpoint2 = `http://${IP_ADDRESS}:5000/remove-from-cart/${product.productID}/${contactNum}`;

      try {
        // Make API call
        const response = await fetch(apiEndpoint2);
        if (response.ok) {
          // If the API call is successful, dispatch the action to update the Redux store
          dispatch(removeFromCart(product.productID));
        } else {
          console.error("Remove from cart API call failed", response);
        }
      } catch (error) {
        console.error(
          "Remove from cart API call failed with an exception:",
          error
        );
      }
    }
  };
  // Render the component
  return (
    <View style={{ flex: 1 }}>
      {/* Customize status bar color */}
      <StatusBar
        backgroundColor="#25d366"
        barStyle="light-content"
        translucent={true}
        height={20}
      />

      {/* Appbar/Header */}
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={store.storeName} />
        {/* Cart icon with badge */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CartScreen", { contactNum: contactNum })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Appbar.Action
              icon="cart"
              onPress={() =>
                navigation.navigate("CartScreen", { contactNum: contactNum })
              }
            />

            {cartItems.length > 0 && (
              <Badge
                visible={cartItems.length > 0}
                size={23}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                {cartItems.length}
              </Badge>
            )}
          </View>
        </TouchableOpacity>
      </Appbar.Header>

      {/* Store Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/350" }}
        style={{ height: 200, width: "100%" }}
      />

      {/* Products */}
      <ScrollView>
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.productID} style={styles.productContainer}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                {/* Add/Remove from Cart button */}
                <TouchableOpacity
                  onPress={() => handleAddToCart(product)}
                  style={styles.addToCartButton}
                >
                  <Text style={styles.addToCartText}>
                    {cartItems.filter(
                      (item) => item.productID === product.productID
                    ).length > 0
                      ? "Remove"
                      : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}

        {/* "View Cart" button */}
        {showViewCartButton && (
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() =>
              navigation.navigate("CartScreen", { contactNum: contactNum })
            }
          >
            <Text style={styles.viewCartButtonText}>
              Unique Items in Cart ({cartItems.length})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default StoreDetailsScreen;
