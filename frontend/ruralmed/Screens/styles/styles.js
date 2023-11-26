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
});
