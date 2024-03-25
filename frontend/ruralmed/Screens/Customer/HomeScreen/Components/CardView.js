import { TouchableOpacity,View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card, Paragraph, Title, Text } from "react-native-paper";
const CardView = ({navigation,store,handleStoreCardPress,locationNames,index,emailUser,contactNumberCustomer}) => {
  return (
    <TouchableOpacity
      key={store.storeID}
      onPress={() => {
        handleStoreCardPress(store);
      }}
    >
      <Card
        key={store.storeID}
        style={{ margin: "2%", borderRadius: 10, overflow: "hidden" }}
      >
        <Card.Cover source={{ uri:
          ( store.storeType==='Agriculture'?"https://i.ibb.co/VSbD0cf/pexels-flambo-1112080-1.jpg": store.storeType==="Pharmacy" ? "https://i.ibb.co/59nTNhP/laurynas-me-1-TL8-Ao-EDj-c-unsplash.jpg":'https://i.ibb.co/J5bFMhq/istockphoto-1167064450-612x612.jpg'
          )
           
           }} />
        <Card.Content>
          <Title>{store.storeName}</Title>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="location"
              size={20}
              color="#25d366"
              style={{ marginRight: 8 }}
            />
            <Paragraph>{locationNames[index]}</Paragraph>
            
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="call"
              size={20}
              color="#25d366"
              style={{ marginRight: 8 }}
            />
            <Paragraph>{store.storeContact}</Paragraph>
            
          { (store.storeType==='Veteran' || store.storeType==='Pharmacy') ? (<TouchableOpacity
              style={{
                backgroundColor: "#25d366",
                padding: 12,
                borderRadius: 50,
                marginTop: 10,
                marginLeft: "25%",
                alignItems: "flex-end",
              }}
              onPress={() => {
                console.log(emailUser);
                navigation.navigate("UploadPrescriptionScreen", {
                  email: emailUser,
                  store,
                  contactNumberCustomer,
                });
              }}
            >
              <Text style={{ color: "white" }}>Upload Prescription</Text>
            </TouchableOpacity>):("")}
            
          </View>
          
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};
export default CardView;
