import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, TextInput, Title } from 'react-native-paper';

import styles from '../Styles/styles';
const DetailItem = ({ label, value, editingField, handleEdit, handleUpdate, onChangeText }) => {
  return (
    <View style={styles.detailItem}>
      <Ionicons
        name={label=='Email'?"mail":label=='City'?"location":'call'}
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
      {!(label==='Email') && <Button onPress={editingField ? handleUpdate : ()=>{handleEdit(editingField)}}>
        {editingField ? 'Update' : 'Edit'}
      </Button>
}
    </View>
  );
};

export default DetailItem;
