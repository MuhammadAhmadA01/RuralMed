
import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    errorText: {
      color: "red",
      textAlign: "left",
      fontSize: 12,
      marginTop: 5,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f2f2f2",
    },
    imageContainer: {
      marginBottom: 20,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 20,
      width: 200,
      borderRadius: 5,
      backgroundColor: "white",
    },
    title: {
      fontSize: 24, // Adjust the font size as needed
      fontWeight: "bold", // Use 'bold' for a bolder weight
      marginBottom: 20, // Adjust the margin as needed
    },
    button: {
      backgroundColor: "#25d366",
      padding: 10,
      borderRadius: 5,
      width: 200,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
    },
    signupButton: {
        width: "90%",
        padding: 1,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        backgroundColor: "#25d366",
        //marginTop:75
      
    },
    signupButtonText: {
      borderRadius:20,
      color: "#ffff",
      fontWeight: "bold",
      fontSize: 21,
      marginVertical: 9,
      backgroundColor: "#25d366",
    
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      width: 200,
    },
    identityText: {
      color: "#333", // Adjust the color as needed
      marginBottom: 20,
    },
    instructionsContainer: {
      marginTop: 0,
      paddingHorizontal: 20,
    },
    instructionsTitle: {
      color: "#25d366",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    instructionsText: {
      fontSize: 16,
      color: "#333",
    },
  });

  export default styles