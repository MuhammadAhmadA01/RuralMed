import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerScreen from "./Screens/Customer/CustomerInputScreen";
import LoginScreen from "./Screens/User/UserLoginScreen";
import RiderScreen from "./Screens/Rider/RiderInputScreen";
import StoreOwnerScreen from "./Screens/Owner/StoreOwnerScreen";
import CustomerHomeScreen from "./Screens/Customer/CustomerHomeScreen";
import OwnerHomeScreen from "./Screens/Owner/OwnerHomeScreen";
import Signup from "./Screens/User/UserSignupScreen";
import StoreScreen from "./Screens/Owner/OwnerCreateStoreScreen";
import RiderHomeScreen from "./Screens/Rider/RiderHomeScreen";
import StoreDetailsScreen from "./Screens/Customer/StoreDetailsScreen";
import CartScreen from "./Screens/Customer/CartScreen";

import { Provider } from "react-redux"; // Import Provider from react-redux
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Components/Cart/CartSlice"; // Update the path
import AddProductScreen from "./Screens/Owner/OwnerProductScreen";
import AllStoresScreen from "./Screens/Owner/AllStoresScreen";
import PlaceOrderScreen from "./Screens/Customer/PlaceOrderScreen";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add other reducers if needed
  },
});

export default function App() {
  const Stack = createNativeStackNavigator();

  // Customize the theme with your preferred colors
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#25d366", // Replace with your primary color
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="signup" component={Signup} />
            <Stack.Screen name="Customer" component={CustomerScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="Rider" component={RiderScreen} />
            <Stack.Screen name="Owner" component={StoreOwnerScreen} />
            <Stack.Screen name="HomeCustomer" component={CustomerHomeScreen} />
            <Stack.Screen name="HomeOwner" component={OwnerHomeScreen} />
            <Stack.Screen name="HomeRider" component={RiderHomeScreen} />
            <Stack.Screen name="OwnerStoreScreen" component={StoreScreen} />
            <Stack.Screen name="StoreDetails" component={StoreDetailsScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="OwnerAddProductScreen" component={AddProductScreen} />
            <Stack.Screen name="OwnerAllStoreScreen" component={AllStoresScreen} />
            <Stack.Screen name="PlaceOrderScreen" component={PlaceOrderScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
