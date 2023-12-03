import IP_ADDRESS from '../../config/config';
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { styles } from '../styles/styles'; // Import your login screen styles here
import AsyncStorage  from '@react-native-async-storage/async-storage';
const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    checkAuthentication();
  }, []);
  
  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Token exists, verify with the server
        const response = await fetch(`http://${IP_ADDRESS}:5000/verify-token`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
  
        const data = await response.json();
        if (data.success) {
          // Token is valid, get the role from AsyncStorage
          const role = await AsyncStorage.getItem('role');
  
          // Navigate to the home screen with the role
          navigation.navigate(`Home${role}`);
           } else {
          // Token is not valid, show alert and stay on the login screen
          Alert.alert('Session Expired', 'Please login again');
          AsyncStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // Handle error, e.g., navigate to the login screen
      navigation.navigate('login');
    }
  };
  
  const handleLogin = () => {
    // Perform login logic here
    // For example, you can make a fetch request to your backend with email and password

    fetch(`http://${IP_ADDRESS}:5000/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contactNumber: phone, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Handle successful login
          Alert.alert('Login Successful', `Welcome back! ${data.role}`);
   
          navigation.navigate(`Home${data.role}`);
          
          AsyncStorage.setItem('token', data.token);
          AsyncStorage.setItem('phone', phone);
          AsyncStorage.setItem('role', data.role);

          
          // You might want to navigate to another screen upon successful login
          // navigation.navigate('Home'); // Uncomment and replace 'Home' with your desired screen
        } else {
          // Handle unsuccessful login
          Alert.alert('Login Failed', data.error || 'Unknown error occurred.');
        }
      })
      .catch(error => {
        console.error('Error during login:', error.message);
        Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      });
  };

  const navigateToSignup = () => {
    // Navigate to the signup screen
    navigation.navigate('signup');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.ibb.co/34w40Nc/your-logo.png' }}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone #"
        value={phone}
        onChangeText={setPhone}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signupLinkContainer}>
        <Text style={styles.signupText}>New to RuralMed?</Text>
        <TouchableOpacity onPress={navigateToSignup}>
          <Text style={styles.signupLink}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
