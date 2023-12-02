import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Appbar, Badge } from "react-native-paper";

const StoreDetailsScreen = ({ route, navigation }) => {
  const { store, products } = route.params;
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    const updatedCart = [...cartItems];
    const existingItemIndex = updatedCart.findIndex(
      (item) => item.productID === product.productID
    );

    if (existingItemIndex !== -1) {
      // If the item exists, remove it from the cart
      updatedCart.splice(existingItemIndex, 1);
    } else {
      // If the item doesn't exist, add it to the cart
      updatedCart.push(product);
    }

    setCartItems(updatedCart);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="#25d366"
        barStyle="light-content"
        translucent={true}
        height={20}
      />

      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={store.storeName} />
        <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Appbar.Action
              icon="cart"
              onPress={() => console.log("cart icon pressed")}
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

      <Image source={{ uri: "https://via.placeholder.com/350" }} style={{ height: 200, width: "100%" }} />

      <ScrollView>
        {products.map((product) => (
          <View key={product.productID} style={styles.productContainer}>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
              <TouchableOpacity onPress={() => handleAddToCart(product)} style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>
                  {cartItems.find((item) => item.productID === product.productID) ? "-" : "+"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.viewCartButton} onPress={() => navigation.navigate("CartScreen")}>
            <Text style={styles.viewCartButtonText}>View Cart ({cartItems.length})</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  productDetails: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    color: "gray",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: "#25d366",
    padding: 14,
    borderRadius: 5,
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  addToCartText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  viewCartButton: {
    width: "90%",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    backgroundColor: "#25d366",
  },
  viewCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default StoreDetailsScreen;
