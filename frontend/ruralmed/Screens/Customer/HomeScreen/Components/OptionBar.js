import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {styles }from '../styles';
import { Divider } from 'react-native-paper';
const OptionBar = ({ selectedOption, onSelectOption }) => {
  return (
    <View style={styles.optionBar}>
      <TouchableOpacity
        style={[styles.option, selectedOption === 'Browse Stores' && styles.selectedOption]}
        onPress={() => onSelectOption('Browse Stores')}
      >
        <Text style={[styles.optionText,selectedOption === 'Browse Stores' && styles.selectedOption]}>Browse Stores</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, selectedOption === 'Book an Appointment' && styles.selectedOption]}
        onPress={() => onSelectOption('Book an Appointment')}
      >
        <Text style={[styles.optionText,selectedOption === 'Book an Appointment' && styles.selectedOption]}>Book an Appointment
        
        </Text>
        
      </TouchableOpacity>
    </View>
  );
};
export default OptionBar;