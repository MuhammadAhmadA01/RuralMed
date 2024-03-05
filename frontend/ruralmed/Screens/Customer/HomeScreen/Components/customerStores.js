import { ScrollView,ActivityIndicator } from "react-native";
import Chips from '../Components/Chips'
import {  Title, Text } from "react-native-paper";
import CardView from "./CardView";
import { styles } from "../styles";
const Stores=({handleStoreTypeChange,selectedStoreType,isLoading,filteredStores,emailUser,contactNumberCustomer,locationNames,handleStoreCardPress,storesFound,navigation})=>{
return (<ScrollView>
<Title style={styles.title}>Categories</Title>
<Chips
  handleStoreType={handleStoreTypeChange}
  selectedStoreType={selectedStoreType}
  categories={["All", "Pharmacy", "Veteran", "Agricultural"]}
></Chips>
<Title
  style={{ marginLeft: "3%", color: "#25d366", fontWeight: "700" }}
>
  Featured Stores
</Title>
<ScrollView>
  {isLoading ? (
    <ActivityIndicator size="large" color="#25d366" margin={200} />
  ) : filteredStores.length > 0 ? (
    filteredStores.map((store, index) => (
      <CardView
        key={store.storeID}
        emailUser={emailUser}
        store={store}
        navigation={navigation}
        contactNumberCustomer={contactNumberCustomer}
        locationNames={locationNames}
        index={index}
        handleStoreCardPress={handleStoreCardPress}
      ></CardView>
    ))
  ) : (
    <Text style={{ margin: "35%", fontWeight: "700" }}>
      {storesFound ? "Loading stores..." : "No stores found"}
    </Text>
  )}
</ScrollView>
</ScrollView>
)};
export default Stores;