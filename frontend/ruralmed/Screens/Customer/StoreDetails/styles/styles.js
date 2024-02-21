import { StyleSheet } from "react-native";
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
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 30,
      paddingRight: 30,


      borderRadius: 50,
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
      padding: 1,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
      backgroundColor: "#25d366",
      marginTop:75
    },
    viewCartButtonText: {
      borderRadius:20,
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
      marginVertical: 9,
      backgroundColor: "#25d366",
    },
    cartBadge: {
      backgroundColor: "red",
      borderRadius: 10,
      padding: 5,
      position: "absolute",
      top: 5,
      right: 5,
    },
    cartBadgeText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12,
    },
  });
  
  export default styles