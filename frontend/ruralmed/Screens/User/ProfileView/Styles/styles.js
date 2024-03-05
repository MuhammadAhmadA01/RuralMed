import { StyleSheet,Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      // Add styles for header if needed
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    profileInfo: {
      borderTopLeftRadius:50,
      borderTopRightRadius:50,
      height:'60%',
      width:'90%',
      backgroundColor:'white',
      marginTop:130,
      marginLeft:20,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    editIconContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      marginBottom: 11,
      padding: 12,
    },
    
    avatar: {
      marginBottom: 20,
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    detailsContainer: {
      marginTop:20,
      width: '80%',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    input: {
     // height: windowHeight * 0.06, // Use a percentage of the window height
      flex:1,
      marginLeft: 10,
      marginRight: 10,
    },
    imageContainer:{
      elevation:15,
      //marginTop:20,
      borderBottomRightRadius:50,
      borderBottomLeftRadius:50,
  
      backgroundColor:'#25d366',
      alignItems:'center'
    },
    mapSelect:{
        fontSize: windowWidth * 0.04,
        color: "#25d366",
        fontWeight: "bold",
          marginLeft: "10px",
          textDecorationLine: "underline",
          color: "#25d366",
        },
  });
  export default styles;