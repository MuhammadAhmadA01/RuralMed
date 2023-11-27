import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerScreen from './Screens/Customer/CustomerInputScreen';
import LoginScreen from './Screens/User/UserLoginScreen';
import RiderScreen from './Screens/Rider/RiderInputScreen';
import StoreOwnerScreen from './Screens/Owner/StoreOwnerScreen';
import CustomerHomeScreen from './Screens/Customer/CustomerHomeScreen';
import OwnerHomeScreen from './Screens/Owner/OwnerHomeScreen';
import Signup from './Screens/User/UserSignupScreen';

export default function App() {
  const Stack = createNativeStackNavigator();

  // Customize the theme with your preferred colors
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#25d366', // Replace with your primary color
       },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="signup" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signup" component={Signup} />
          <Stack.Screen name="Customer" component={CustomerScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="Rider" component={RiderScreen} />
          <Stack.Screen name="Owner" component={StoreOwnerScreen} />
          <Stack.Screen name="HomeCustomer" component={CustomerHomeScreen} />
          <Stack.Screen name="HomeOwner" component={OwnerHomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
