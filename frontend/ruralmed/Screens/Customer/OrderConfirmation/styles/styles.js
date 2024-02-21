import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    orderDetailsTitle: {
      marginLeft: "3%",
      color: "#25d366",
      fontWeight: "700",
      marginTop: "2%",
    },
    card: {
      margin: 10,
      borderRadius: 10,
      backgroundColor: "#fff",
      elevation: 3,
    },
    productName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    deliveryTimeContainer: {
      margin: 10,
    },
    deliveryTimeText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    riderDetailsContainer: {
      margin: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: "#f0f0f0",
    },
    riderDetailsHeading: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#25d366",
      marginBottom: 10,
    },
    dialerButton: {
      marginTop: 10,
      backgroundColor: "#25d366",
    },
    subtotalContainer: {
      margin: 10,
    },
    subtotalText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    totalText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#25d366",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    homeButton: {
      backgroundColor: "#25d366",
      padding: 16,
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    homeButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
export default styles;  