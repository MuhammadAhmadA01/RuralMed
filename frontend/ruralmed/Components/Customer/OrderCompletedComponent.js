import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const OrderCompletedComponent = () => {
  return (
    <View style={styles.orderCompletedContainer}>
      <Text style={styles.orderCompletedText}>
        Order Completed {"\n"} How was your experience?
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCompletedContainer: {
    margin: 8,
    elevation: 15,
    backgroundColor: "#c1e7c3", // Greenish background
    padding: 25,
  },
  orderCompletedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black", // Primary color
    textAlign: "center",
  },
});

export default OrderCompletedComponent;
