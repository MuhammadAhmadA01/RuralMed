import { StyleSheet, Dimensions } from "react-native";
const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  placeholderStyle: {
    fontSize: 15,
    marginLeft: 10,
  },
  rowDvmContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  selectedTextStyle: {
    fontSize: 15,
    borderRadius: 50,
    marginLeft: 10,
  },
  filtersContainerDvm: {
    marginBottom: 10,
    width: widthScreen * 0.4,
  },

  inputSearchStyle: {
    height: 42,
    fontSize: 16,
    borderRadius: 50,
  },
  dropdown: {
    width: widthScreen * 0.4,
    height: 45,
    borderRadius: 50,

    backgroundColor: "transparent",
    // elevation: 2,
  },
  icon: {
    marginLeft: widthScreen * 2,
  },
  rating: {
    textAlign: "center",
    alignItems: "center",
    color: "white",
    marginTop: 0,
  },
  titleHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color:'#25d366'
  
  },
  titleHeadingAbout: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color:'#25d366'
  },
  button: {
    position: "absolute",
    marginTop: heightScreen*0.937,
    marginLeft: 6,
    width: widthScreen*0.97,
  },
});
