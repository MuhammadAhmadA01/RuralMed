// styles.js

import { StyleSheet,Dimensions } from 'react-native';
const widthScreen=Dimensions.get('window').width
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: '#25d366',
    barStyle: 'light-content',
    translucent: true,
    height: 20,
  },
  appbarHeader: {
    backgroundColor: '#25d366',
  },
  searchbar: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  searchInput: {
    color: 'black',
  },
  fab: {
    position: 'absolute',
    margin: 6,
    right: 0,
    bottom: 65,
    backgroundColor: '#25d366',
    zIndex: 1,
  },
  title: {
    marginLeft: '3%',
    color: '#25d366',
    fontWeight: '700',
    marginTop: '2%',
  },
  chipsContainer: {
    marginLeft: '3%',
    color: '#25d366',
    fontWeight: '700',
  },
  cardContainer: {
    margin: '35%',
    fontWeight: '700',
  },
  loadingIndicator: {
    margin: 200,
  },
  badge:{
    
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    color: "black",
  },
  notBadge:{
    
    position: "absolute",
    top: 8,
    right: 54,
    backgroundColor: "white",
    color: "black",
  },
  
  containerDvm: {
    flex: 1,
    padding: 10,
  },
  filtersContainerDvm: {
    marginBottom: 10,
    width:widthScreen*0.40,
  },
  dropdownDvm: {
   width:widthScreen*0.1 
  },
  cardsContainerDvm: {
    flex: 1,
  },
  cardDvm: {
    marginBottom: 30,
    width:widthScreen*0.47,
 
  },
  cardImageDvm: {
    height: 110,
    width:widthScreen*0.28,
    borderRadius:50,
    marginLeft:37,
    marginTop:15
  },
  cardTextDvm: {
    marginBottom: 5,
    marginTop:2
  },
  scrollContainerDvm: {
    flexGrow: 0.1,
  },
  rowDvm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 0, 
  },
  
  titleDvm: {
    fontWeight: '700',
    textAlign: 'center', // Add textAlign property to center the text
    marginTop: 5,
  },
  rowDvmContainer:{
    flexDirection:'row',
    justifyContent:'space-evenly',
   
  },
  placeholderStyle: {
    fontSize: 15,
    marginLeft:10,
  },
  selectedTextStyle: {
    fontSize: 15,
    borderRadius:50,
    marginLeft:10,
  },
  
  inputSearchStyle: {
    height: 42,
    fontSize: 16,
    borderRadius:50,
  },
  dropdown: {
    width:widthScreen*0.4,
    height: 45,
    borderRadius:50,

    backgroundColor:'transparent',
   // elevation: 2,
  },
  optionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', // Change the background color as needed
    paddingVertical: 10,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,

  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    // Color of the underline
  },
  selectedOption: {
   color:'#25d366' 
  },
  
  optionText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333', // Change the text color as needed
  },
  
  });

