import { StyleSheet, Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginTop: 0,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    mapLabel: {
        fontSize: windowWidth * 0.05, // Use a percentage of the window width
        color: "#25d366",
        marginBottom: "2%",
    
        marginLeft: "3.5%", // Use percentage for margin
      },
      timePickerContainer: {
        marginTop: 15,
      },
      signupLink: {
        marginTop:20,
        fontSize: windowWidth * 0.06,
        color: "#25d366",
        fontWeight: "bold",
        marginLeft: "10px",
        textDecorationLine: "underline",
        color: "#25d366",

      },
      
    input: {
      height: 40,
      borderColor: "#25d366",
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderRadius: 50,

    },
    availabilityContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    button: {
      backgroundColor: "#25d366",
      paddingVertical: 10,
      borderRadius: 50,
      alignItems: "center",
      //marginTop: 20,
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
  });
export default styles;  