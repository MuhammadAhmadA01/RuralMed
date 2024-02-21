import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
      
        width: "90%",
        padding: 1,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        backgroundColor: "#25d366",
        //marginTop:75
        borderRadius:20,
        color: "#00000",
        fontWeight: "bold",
        fontSize: 82,
        marginVertical: 9,
        backgroundColor: "#25d366",
      },
     
    
  });
export default styles;  