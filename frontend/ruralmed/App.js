import React from "react";
import { useEffect, useState } from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomerScreen from "./Screens/Customer/CustomerInputScreen/CustomerInputScreen";
import LoginScreen from "./Screens/User/UserLoginScreen";
import RiderScreen from "./Screens/Rider/RiderInputScreen";
import StoreOwnerScreen from "./Screens/Owner/StoreOwnerScreen";
import CustomerHomeScreen from "./Screens/Customer/HomeScreen/CustomerHomeScreen";
import OwnerHomeScreen from "./Screens/Owner/OwnerHomeScreen";
import Signup from "./Screens/User/UserSignupScreen";
import StoreScreen from "./Screens/Owner/OwnerCreateStoreScreen";
import RiderHomeScreen from "./Screens/Rider/RiderHomeScreen";
import StoreDetailsScreen from "./Screens/Customer/StoreDetails/StoreDetailsScreen";
import CartScreen from "./Screens/Customer/CartScreen/CartScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "react-redux"; // Import Provider from react-redux
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Components/Cart/CartSlice"; // Update the path
import AddProductScreen from "./Screens/Owner/OwnerProductScreen";
import AllStoresScreen from "./Screens/Owner/AllStoresScreen";
import PlaceOrderScreen from "./Screens/Customer/PlaceOrder/PlaceOrderScreen";
import LoadingScreen from "./Screens/Customer/OrderAnimation/OrderAnimation";
import { ActivityIndicator, View } from "react-native";
import OrderConfirmationScreen from "./Screens/Customer/OrderConfirmation/OrderRiderScreenMap";
import UploadPrescriptionScreen from "./Screens/Customer/UploadPrescription/UploadPrescriptionScreen";
import PrescriptionPlaceOrderScreen from "./Screens/Customer/PlacePrescriptionOrder/PrescriptionPlaceOrder";
import NotificatonOrderDetailScreen from "./Screens/Rider/DisplayNotificationScreen";
import MapComponent from "./Screens/MapView/MapInputComponent";
import CustomerAllOrders from "./Screens/Customer/CustomersAllOrders/CustomersAllOrders";
import RatingReviewScreen from "./Screens/Customer/RatingReviewScreen/RatingReviewScreen";
import ChatScreen from "./Screens/User/ChatScreen";
import AllOrdersScreen from "./Screens/User/AllOrdersScreen";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add other reducers if needed
  },
});

export default function App() {
  const [loading, setLoading] = useState(true); // Add a loading state

  const Stack = createNativeStackNavigator();
  const [initialScreen, setInitialScreen] = useState("login");

  // Customize the theme with your preferred colors
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#25d366", // Replace with your primary color
    },
  };
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Get the role from AsyncStorage
        const role = await AsyncStorage.getItem("role");

        // If the role exists, update the initial screen state
        if (role) {
          setInitialScreen(`Home${role}`);
        }
      } catch (error) {
        console.error("Error reading user role from AsyncStorage:", error);
      } finally {
        // Set loading to false once useEffect is completed
        setLoading(false);
      }
    };

    // Call the function when the component mounts
    checkUserRole();
  }, []);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#25d366" />
      </View>
    );
  }
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialScreen || "login"}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="signup" component={Signup} />
            <Stack.Screen name="Customer" component={CustomerScreen} />
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="Rider" component={RiderScreen} />
            <Stack.Screen name="Owner" component={StoreOwnerScreen} />
            <Stack.Screen name="MapInput" component={MapComponent}/>
            <Stack.Screen name="RateScreen" component={RatingReviewScreen}/>
   
            <Stack.Screen
              name="AllOrdersScreen"
              component={AllOrdersScreen}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
            />
            
            <Stack.Screen
              name="CustomersAllOrders"
              component={CustomerAllOrders}
            />
            <Stack.Screen
              name="UploadPrescriptionScreen"
              component={UploadPrescriptionScreen}
            />

            <Stack.Screen
              name="PrescriptionPlaceOrderScreen"
              component={PrescriptionPlaceOrderScreen}
            />

            <Stack.Screen name="HomeCustomer" component={CustomerHomeScreen} />
            <Stack.Screen name="HomeOwner" component={OwnerHomeScreen} />
            <Stack.Screen name="HomeRider" component={RiderHomeScreen} />
            <Stack.Screen name="OwnerStoreScreen" component={StoreScreen} />
            <Stack.Screen name="StoreDetails" component={StoreDetailsScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen
              name="OwnerAddProductScreen"
              component={AddProductScreen}
            />
            <Stack.Screen
              name="OwnerAllStoreScreen"
              component={AllStoresScreen}
            />
            <Stack.Screen
              name="PlaceOrderScreen"
              component={PlaceOrderScreen}
            />
            <Stack.Screen name="OrderAnimation" component={LoadingScreen} />
            <Stack.Screen
              name="NotificationOrderDetails"
              component={NotificatonOrderDetailScreen}
            />

            <Stack.Screen
              name="OrderConfirmationScreen"
              component={OrderConfirmationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
