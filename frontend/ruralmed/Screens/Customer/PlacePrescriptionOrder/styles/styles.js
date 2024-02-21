import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    orderDetailsTitle: {
      marginLeft: "3%",
      color: "#25d366",
      fontWeight: "700",
      marginTop: "2%",
    },
    prescriptionImageContainer: {
      alignItems: "center",
      marginTop: 10,
    },
    prescriptionImage: {
      width: 200, // Adjust the width as needed
      height: 200, // Adjust the height as needed
      resizeMode: "contain",
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
    },
    dialerButton: {
      marginTop: 10,
      backgroundColor: "#25d366",
    },
  });
export default styles;  