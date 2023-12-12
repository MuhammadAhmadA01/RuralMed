import IP_ADDRESS from "../../config/config";
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../Components/Cart/CartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { contactNum } = route.params;
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [localQuantities, setLocalQuantities] = useState({});
  const [phoneNum, setPhoneNum] = useState("");
  useEffect(() => {
    const fetchPhone = async () => {
      const phone = await AsyncStorage.getItem("phone");
      setPhoneNum(phone);
    };
    fetchPhone();
  }, [cartItems]);
  const handleRemoveItem = async (productID) => {
    const apiEndpoint2 = `http://${IP_ADDRESS}:5000/remove-from-cart/${productID}/${contactNum}`;

    try {
      // Make API call
      const response = await fetch(apiEndpoint2);
      if (response.ok) {
        // If the API call is successful, dispatch the action to update the Redux store
        dispatch(removeFromCart(productID));
      } else {
        console.error("Remove from cart API call failed", response);
      }
    } catch (error) {
      console.error(
        "Remove from cart API call failed with an exception:",
        error
      );
    }
  };

  useEffect(() => {
    // Update local quantities when cartItems change
    const quantities = {};
    cartItems.forEach((item) => {
      quantities[item.productID] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);
  const handleQuantityChange = async (product, change) => {
    const item = cartItems.find((item) => item.productID === product.productID);
    if (item) {
      if (change > 0) {
        const res = await fetch(`http://${IP_ADDRESS}:5000/add-to-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerContact: phoneNum,
            product,
          }),
        });
        if (res.status === 404) {
          Alert.alert(
            "Limti exceeds",
            "Your quantity exceeds the available quantity"
          );
          return;
        } else
          dispatch(
            updateCartItemQuantity({ productID: product.productID, change })
          );
      } else {
        try {
          // Make a fetch call to update the quantity
          const updateQuantityEndpoint = `http://${IP_ADDRESS}:5000/update-qty/${contactNum}/${product.productID}`;

          const updateResponse = await fetch(updateQuantityEndpoint);
          const minusRes = await updateResponse.json();
          dispatch(
            updateCartItemQuantity({ productID: product.productID, change })
          );
        } catch (error) {
          console.error("Quantity update failed with an exception:", error);
        }
      }
    }
  };

  const calculateSubtotal = () => {
    // Calculate the total price of items in the cart
    return cartItems.reduce(
      (subtotal, item) => subtotal + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    // Perform checkout logic
    navigation.navigate("PlaceOrderScreen", { customerContact: contactNum });
  };

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
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Shopping Cart" />
      </Appbar.Header>
      <Title
        style={{
          marginLeft: "3%",
          color: "#25d366",
          fontWeight: "700",
          marginTop: "2%",
        }}
      >
        Cart Details
      </Title>

      {/* Cart Items */}
      <ScrollView>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Empty cart</Text>
            <TouchableOpacity
              onPress={() => navigation.replace("HomeCustomer")}
            >
              <Text style={styles.browseStoresText}>Browse to Stores</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.productID} style={styles.cartItemContainer}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    item.quantity > 1 && handleQuantityChange(item, -1)
                  }
                  style={item.quantity === 1 ? styles.disabledButton : null}
                  disabled={item.quantity === 1}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {localQuantities[item.productID]}
                </Text>
                <TouchableOpacity onPress={() => handleQuantityChange(item, 1)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleRemoveItem(item.productID);
                }}
              >
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Order Subtotal */}
      {cartItems.length > 0 ? (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Order Subtotal: ${calculateSubtotal()}
          </Text>
          <Text style={styles.shippingText}>
            Shipping charges will be calculated on checkout
          </Text>
        </View>
      ) : (
        <Text></Text>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 ? (
        <Button
          mode="contained"
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          Checkout
        </Button>
      ) : (
        <Text></Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Style definitions for the CartScreen
  cartItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 5,
    color: "black",
  },
  removeButton: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtotalContainer: {
    margin: 10,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shippingText: {
    fontSize: 14,
    color: "gray",
  },
  checkoutButton: {
    margin: 16,
    backgroundColor: "#25d366",
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "60%",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  browseStoresText: {
    fontSize: 16,
    color: "#25d366",
    marginTop: 10,
  },
});

export default CartScreen;
