import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // Style definitions for the CheckoutScreen
    orderDetailsTitle: {
      marginLeft: "3%",
      color: "#25d366",
      fontWeight: "700",
      marginTop: "2%",
    },
    cartItemContainer: {
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
      fontSize: 16,
      fontWeight: "bold",
    },
    productDetailsText: {
      fontSize: 14,
      color: "gray",
    },
    subtotalContainer: {
      margin: 10,
    },
    subtotalText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    checkoutButton: {
      margin: 16,
      backgroundColor: "#25d366",
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
    },
  });
export default styles  