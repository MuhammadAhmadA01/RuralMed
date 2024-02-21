import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    reviewSection: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    reviewTitle: {
      fontSize: 18,
      color: "#25d366", // Primary color
      marginBottom: 10,
    },
    reviewDescription: {
      marginBottom: 10,
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      backgroundColor: "white",
    },
    submitButton: {
      backgroundColor: "#25d366", // Primary color
    },
  });
export default styles;  