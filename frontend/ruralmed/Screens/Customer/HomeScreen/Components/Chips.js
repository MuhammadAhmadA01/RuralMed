import { View } from "react-native";
import { Chip } from "react-native-paper";
const Chips = ({ selectedStoreType,handleStoreType }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: "2%",
      }}
    >
      {["All", "Pharmacy", "Veteran", "Agricultural"].map((type) => (
        <Chip
          key={type}
          mode={selectedStoreType === type ? "outlined" : "flat"}
          onPress={() => handleStoreType(type)}
          style={{
            backgroundColor:
              selectedStoreType === type ? "transparent" : "#25d366",
            borderColor: selectedStoreType === type ? "#25d366" : "transparent",
            borderWidth: 1,
            borderRadius:50,
            padding:3
          }}
          textStyle={{
            color: selectedStoreType === type ? "#25d366" : "white",
          }}
        >
          {type}
        </Chip>
      ))}
    </View>
  );
};
export default Chips;
