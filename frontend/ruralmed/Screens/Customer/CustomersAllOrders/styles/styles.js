import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    chipContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 16,
    },
    chip: {
      backgroundColor: "#25d366",
    },
    scrollView: {
      flex: 1,
    },
    card: {
      height:118,
      marginVertical: 8,
      borderRadius: 10,
    },
    reviewSubmittedText: {
      color: "#888", // or any other gray color
      fontSize: 18,
      textAlign: "right",
      marginRight: 5,
    },
    
    bottomButton: {
      padding: 1,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
      backgroundColor: "#25d366",
     
    },
    reviewButton: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "#25d366",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    
  });
  export default styles;