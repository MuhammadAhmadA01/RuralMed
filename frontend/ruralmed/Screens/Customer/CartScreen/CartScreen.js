import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./Components/CartItem";
import styles from "./styles/styles";
const CartScreen = ({ navigation, route }) => {
  const { contactNum } = route.params;
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log(cartItems)
  const [localQuantities, setLocalQuantities] = useState({});
  useEffect(() => {
    const quantities = {};
    cartItems.forEach((item) => {
      quantities[item.productID] = item.quantity;
    });
    setLocalQuantities(quantities);
  }, [cartItems]);
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
      <StatusBar
        backgroundColor="#25d366"
        barStyle="light-content"
        translucent={true}
        height={20}
      />
      <Appbar.Header style={{backgroundColor:'#25d366'}}>
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
            <CartItem
              key={item.productID}
              item={item}
              localQuantities={localQuantities}
              phoneNum={contactNum}
            />
          ))
        )}
      </ScrollView>
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
export default CartScreen;
