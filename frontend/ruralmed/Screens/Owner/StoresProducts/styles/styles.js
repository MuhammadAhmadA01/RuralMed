import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    productContainer: {
      margin: 10,
      padding: 10,
      borderRadius: 30,
      backgroundColor: "#fff",
      elevation: 3
    },
    productDetails: {
      marginLeft: 10,
      flex: 1,
    },
    productName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    productDescription: {
      fontSize: 14,
      color: "gray",
    },
    productPrice: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 5,
    },
    addToCartButton: {
      backgroundColor: "#25d366",
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 30,
      paddingRight: 30,


      borderRadius: 50,
      position: "absolute",
      bottom: 5,
      right: 5,
    },
    addToCartText: {
      color: "black",
      fontWeight: "bold",
      fontSize: 18,
    },
    viewCartButton: {
      width: "90%",
      padding: 1,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
      backgroundColor: "#25d366",

    },
    viewCartButtonText: {
      borderRadius:20,
      color: "#fff",
      fontWeight: "bold",
      fontSize: 18,
      marginVertical: 9,
      backgroundColor: "#25d366",
    },
    cartBadge: {
      backgroundColor: "red",
      borderRadius: 10,
      padding: 5,
      position: "absolute",
      top: 5,
      right: 5,
    },
    cartBadgeText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 12,
    },
    badge:{
      position: "absolute",
      top: 2,
      right: 2,
      backgroundColor: "white",
      color: "black",
    
    },
    image:{
      height: 200,
      width: "100%",
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
   
    },
    editButton: {
      padding: 15,
      backgroundColor: "#25d366",
      borderRadius: 50,
      marginTop: 5,
    },
    editButtonText: {
      color: "#fff",
      textAlign: "center",
      fontSize:18

    },
    removeButton: {
      padding: 15,
      backgroundColor: "red",
      borderRadius: 50,
      marginTop: 5,
    },
    removeButtonText: {
      color: "#fff",
      textAlign: "center",
      fontSize:18
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    modalInput: {
      borderWidth: 1,
      marginBottom: 5,
      marginTop:4,
      fontSize: 16,
      borderRadius:50,
      padding:15,
      borderColor:'#25d366'
    },
    modalButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    modalButton: {
      padding: 10,
      backgroundColor: "#25d366",
      borderRadius: 5,
      width: "45%",
    },
    modalButtonText: {
      color: "#fff",
      textAlign: "center",
    },
    noProducts:{
      marginLeft:75,
      marginTop:170,
      fontWeight:'600',
      fontSize:25
    },
    
  getStartedText: {
    color: "#25d366",
    fontWeight: "bold",
    marginLeft:125,
    marginTop:20,
  },
  iconButton:{
    marginLeft:50
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius:50,
    backgroundColor: "#25d366",
  },


  });
  
  export default styles