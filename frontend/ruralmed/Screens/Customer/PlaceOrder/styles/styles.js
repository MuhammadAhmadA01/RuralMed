import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // Style definitions for the CheckoutScreen
    orderDetailsTitle: {
      marginLeft: "3%",
      color: "#25d366",
      fontWeight: "700",
      marginTop: "2%",
    },
    paymentText:{
      fontSize:20,
      color:'#25d366',
      marginLeft:15,
      fontWeight:'500'
    },
    imageContainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    uploadText:{
      fontSize:20,
      color:'#25d366',
      marginLeft:40,
      fontWeight:'800',
      textDecorationLine:'underline'
    },
    
    radioButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
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
    verifyPaymentButton:{
      width: "50%",
      padding: 12,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
      backgroundColor: "#25d366",
      marginLeft:96
    },
    paymentVerifiedContainer: {
      backgroundColor: 'white', // Example background color
      padding: 10,
      marginTop: 20,
      borderRadius: 5,
    },
    paymentVerifiedText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#25d366', // Example text color
    },

  });
export default styles  