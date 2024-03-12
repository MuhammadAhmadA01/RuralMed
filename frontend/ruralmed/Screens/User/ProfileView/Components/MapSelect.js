import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/styles';

const MapSelect = ({ navigation, handleLocationSelection }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Ionicons
        name="locate"
        size={30}
        color="#25d366"
        style={{ marginRight: 8 }}
      />
      <TouchableOpacity onPress={() => {
        navigation.navigate("MapInput", {
          onSelectLocation: handleLocationSelection,
        });
      }}>
        <Text style={{ fontSize: 13, color:'black' }}>
          Edit your location:{" "}
          <Text style={[{ color: "#25d366", fontWeight: "bold", textDecorationLine: "underline" },styles.mapSelect]}>Click here</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapSelect;
