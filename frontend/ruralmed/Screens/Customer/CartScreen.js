// CartScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../Components/Cart/CartSlice";

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [localQuantities, setLocalQuantities] = useState({});

  const handleRemoveItem = (productID) => {
    dispatch(removeFromCart(productID));
  };
  useEffect(() => {
    // Update local quantities when cartItems change
    const quantities = {};
    cartItems.forEach((item) => {
      quantities[item.productID] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);
  const handleQuantityChange = (productID, change) => {
    const item = cartItems.find((item) => item.productID === productID);
    if (item) {
      console.log(change);
      dispatch(updateCartItemQuantity({ productID, change }));
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
    console.log("checkout pressed");
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
              onPress={() => navigation.navigate("CustomerHome")}
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
                    item.quantity > 1 &&
                    handleQuantityChange(item.productID, -1)
                  }
                  style={item.quantity === 1 ? styles.disabledButton : null}
                  disabled={item.quantity === 1}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {localQuantities[item.productID]}
                </Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.productID, 1)}
                >
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.productID)}
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
