// ProductCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductCard = ({ product }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.productName}>{product.productDetails.name}</Text>
      <Text>{`Price: $${product.productDetails.price}`}</Text>
      <Text>{`Quantity: ${product.quantity}`}</Text>
      <Text>{`Subtotal: ${product.subtotal}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default ProductCard;
