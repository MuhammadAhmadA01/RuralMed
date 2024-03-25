import IP_ADDRESS from "../../../config/config";
import { FontAwesome5 } from "@expo/vector-icons";
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
import { Appbar, Badge, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../../Components/Cart/CartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
const StoreDetailsScreen = ({ route, navigation }) => {
  const { store, products, contactNum } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [showViewCartButton, setShowViewCartButton] = useState(false);
  useEffect(() => {
    setShowViewCartButton(cartItems.length > 0);
  }, [cartItems]);
  const handleAddToCart = async (product) => {
    const existingItem = cartItems.find(
      (item) => item.productID === product.productID
    );
    if (!existingItem) {
      const sameStoreCheck = cartItems.find(
        (item) => item.storeId === product.storeId
      );
      if (sameStoreCheck || !cartItems.length) {
        const apiEndpoint = `http://${IP_ADDRESS}:5000/add-to-cart`;
        const phoneNum = await AsyncStorage.getItem("phone");
        try {
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
        Alert.alert(
          "Choose from Same Store",
          "Cannot add products in cart from different stores"
        );
        return;
      }
    } else {
      const apiEndpoint2 = `http://${IP_ADDRESS}:5000/remove-from-cart/${product.productID}/${contactNum}`;
      try {
        const response = await fetch(apiEndpoint2);
        if (response.ok) {
          dispatch(removeFromCart(product.productID));
        } else console.error("Remove from cart API call failed", response);
      } catch (error) {
        console.error(
          "Remove from cart API call failed with an exception:",
          error
        );
      }
    }
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
                style={styles.badge}
              >
                {cartItems.length}
              </Badge>
            )}
          </View>
        </TouchableOpacity>
      </Appbar.Header>
      <Image
        source={{
          uri:
            store.storeType === "Agriculture"
              ? "https://i.ibb.co/VSbD0cf/pexels-flambo-1112080-1.jpg"
              : store.storeType === "Pharmacy"
              ? "https://i.ibb.co/59nTNhP/laurynas-me-1-TL8-Ao-EDj-c-unsplash.jpg"
              : "https://i.ibb.co/J5bFMhq/istockphoto-1167064450-612x612.jpg",
        }}
        style={styles.image}
      />
      <ScrollView>
        <Title style={{marginLeft:105, fontSize:26, marginTop:20, fontWeight:'700',color:'#25d366'}}>Available Items</Title>
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.productID} style={styles.productContainer}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <Text style={styles.productPrice}>${product.price}</Text>
                <TouchableOpacity
                  onPress={() => handleAddToCart(product)}
                  style={styles.addToCartButton}
                >
                  <Text style={styles.addToCartText}>
                    {cartItems.filter(
                      (item) => item.productID === product.productID
                    ).length > 0
                      ?   <FontAwesome5 name="trash-alt" size={24} color="red" />
                      : <FontAwesome5 name="cart-plus" size={24} color="#25d366" />
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </ScrollView>
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

    </View>
  );
};
export default StoreDetailsScreen;
