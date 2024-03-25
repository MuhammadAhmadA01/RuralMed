import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, TextInput, Title } from "react-native-paper";
import { useState } from "react";
import styles from "../Styles/styles";

const DetailItem = ({
  label,
  value,
  editingField,
  handleEdit,
  handleUpdate,
  onChangeText,
  setEditingField,
}) => {
  const [showClose, setShowClose] = useState(false);
  return (
    <View style={styles.detailItem}>
      <Ionicons
        name={
          label === "Email" ? "mail" : label === "City" ? "location" : "call"
        }
        size={30}
        color="#25d366"
        style={{ marginRight: 8 }}
      />
      {editingField ? (
        <TextInput
          label={label}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      ) : (
        <Text>{value}</Text>
      )}
      {!(label === "Email") && (
        <>
          
            {editingField ? (
              <Ionicons
              onPress={
                editingField
                  ? handleUpdate
                  : () => {
                      setShowClose(true);
                      handleEdit(editingField);
                    }
              }
              name="checkmark" color="#25d366" size={30} />
            ) : (
              <Button onPress={
                editingField
                  ? handleUpdate
                  : () => {
                      setShowClose(true);
                      handleEdit(editingField);
                    }
              }>Edit</Button>
            )}
          {showClose && (
            
              <Ionicons    onPress={() => {
                setShowClose(false);
                setEditingField(null);
              }}
           
           name="close" color="red" size={30}></Ionicons>
          )}
        </>
      )}
    </View>
  );
};

export default DetailItem;
