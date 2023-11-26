import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor:'white'
  },
  title: {
    fontSize: windowWidth * 0.06, // Use a percentage of the window width
    marginBottom: "5%", // Use percentage for margin
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "5%",
  },
  input: {
    height: windowHeight * 0.05, // Use a percentage of the window height
    borderColor: "#25d366",
    borderWidth: 1,
    marginBottom: "3%", // Use percentage for margin
    paddingHorizontal: "3%", // Use percentage for padding
    borderRadius: 8,
  },
  signupButton: {
    backgroundColor: "#25d366",
    borderRadius: 10,
    paddingVertical: "2%", // Use percentage for padding
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
  },
  uploadContainer: {
    alignItems: "center",
    marginBottom: "5%",
  },
  uploadBtnContainer: {
    height: windowWidth * 0.3, // Use a percentage of the window width
    width: windowWidth * 0.3, // Use a percentage of the window width
    borderRadius: windowWidth * 0.15, // Use a percentage of the window width
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25d366",
    overflow: "hidden",
  },
  uploadedImg: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  uploadBtn: {
    textAlign: "center",
    padding: "3%", // Use percentage for padding
    color: "white",
    fontWeight: "bold",
    borderRadius: 8,
    marginTop: "3%", // Use percentage for margin
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: "3%", // Use percentage for margin
  },
  roleText: {
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
    color: "#25d366",
  },
  roleButton: {
    backgroundColor: "transparent",
    padding: "2%", // Use percentage for padding
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#25d366",
  },
  roleButtonText: {
    color: "#25d366",
  },
  selectedRole: {
    backgroundColor: "#25d366",
  },
  selectedRoleText: {
    color: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "5%", // Use percentage for margin
  },
  mapContainer: {
    marginTop: "3%", // Use percentage for margin
    marginBottom: "5%", // Use percentage for margin
    borderRadius: 8,
  },
  mapLabel: {
    fontSize: windowWidth * 0.05, // Use a percentage of the window width
    color: "#25d366",
    marginBottom: "2%"
    
    ,
    marginLeft:"3.5%" // Use percentage for margin
  },
  map: {
    height: windowWidth * 0.4, // Use a percentage of the window width
    width: "100%", // Use 100% width to make it responsive
    borderRadius: 8,
    backgroundColor: "lightgray",
    
  },
  currentLocationButton: {
    backgroundColor: "#25d366",
    borderRadius: 10,
    paddingVertical: "2%", // Use percentage for padding
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3%", // Use percentage for margin
  },
  currentLocationButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
  },
   // New login styles
   loginContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  loginTitle: {
    fontSize: windowWidth * 0.06,
    marginBottom: "5%",
    textAlign: "center",
  },
  loginInput: {
    height: windowHeight * 0.05,
    borderColor: "#25d366",
    borderWidth: 1,
    marginBottom: "3%",
    paddingHorizontal: "3%",
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: "#25d366",
    borderRadius: 10,
    paddingVertical: "2%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "3%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04,
  },
  signupLinkContainer: {
    flexDirection: "row",
    marginTop: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    fontSize: windowWidth * 0.04,
    marginRight: "2%",
  },
  signupLink: {
    fontSize: windowWidth * 0.04,
    color: "#25d366",
    fontWeight: "bold",
  },
  logo: {
    width: windowWidth * 0.4, // Use a percentage of the window width
    height: windowWidth * 0.4, // Use a percentage of the window width
    marginBottom: "1%", // Use percentage for margin
    resizeMode: "contain",
    alignContent:"center", // Make sure the image does not exceed its original size
    marginHorizontal:"26%"
  },
});
