import Chips from "./Components/Chips";
import useFetchEmail from "../../../utils/useFetchEmail";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../../Components/Cart/CartSelector";
import {
  View,
  StatusBar,
  Dimensions,
  BackHandler,
} from "react-native";
import Stores from './Components/customerStores'
import { Badge, Appbar, Searchbar, FAB, Title, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import IP_ADDRESS from "../../../config/config";
import {
  addToCart,
  removeFromCart,
  clearCart,
} from "../../../Components/Cart/CartSlice";
import NotificationsDisplay from "../../../Components/Customer/NotificationsDisplay";
import Menubar from "./Components/Menubar";
import CardView from "./Components/CardView";
const CustomerHomeScreen = ({ navigation }) => {
  const email = useFetchEmail();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapViewVisible, setMapViewVisible] = useState(false);
  const [selectedStoreType, setSelectedStoreType] = useState("All");
  const [locationNames, setLocationNames] = useState({}); // New state to store location names
  const [isLoading, setIsLoading] = useState(true);
  const [storesFound, setStoresFound] = useState(true);
  const isFirstRender = useRef(true);
  const [notifications, setNotifications] = useState([]);
  const cartCount = useSelector(selectCartCount);
  const [isDataLoading, setIsDataLoading] = useState(false); // New state to track data loading
  const [contactNumberCustomer, setContactNumber] = useState("");
  const [originalStores, setOriginalStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [emailUser, setEmailUser] = useState("");
  const windowHeight = Dimensions.get("window").height;
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
   
  }, [email]); // Add email to the dependency array to trigger the effect when email changes

  useEffect(() => {
    const fetchLocationNames = async () => {
      try {
        const promises = originalStores.map(async (store) => {
          const [longitude, latitude] = store.store_address
            .split(",")
            .map(parseFloat);
          var requestOptions = {
            method: "GET",
          };
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=0db7342727cf4b34a2e1e2dd6e964a8d`,
            requestOptions
          );
          const data = await response.json();
          const locationName =
            data.features[0].properties.street +
              "," +
              data.features[0].properties.district || "Unknown";
          return locationName;
        });

        const locationNameResults = await Promise.all(promises);

        setLocationNames(locationNameResults);
        setIsLoading(false);
        setStoresFound(true);
      } catch (error) {
        console.log("Error fetching location names:", error);
        setIsLoading(false);
        setIsDataLoading(false);
        setStoresFound(false);
      }
    };
    fetchLocationNames();
  }, [originalStores]);
  useEffect(() => {
    const getContactEmail = async () => {
      try {
        const contactNumber = await AsyncStorage.getItem("phone");
        setContactNumber(contactNumber);
        setEmailUser(email);

        // Use the email data as needed
        fetch(`http://${IP_ADDRESS}:5000/get-stores/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((stores) => {
            // Update the state with the fetched stores
            if (stores.success) {
              const ridersData = stores.riders.join(",");
              AsyncStorage.setItem("riders", ridersData);
              const storeList = Array.isArray(stores)
                ? stores
                : Object.values(stores);
              setOriginalStores(storeList[0]);
              setFilteredStores(storeList[0]);
              setStoresFound(true);
            }
          })
          .catch((error) => {
            console.log("Error fetching stores:", error);
          });
      } catch (error) {
        console.log("Error fetching contact number:", error);
      }
    };

    getContactEmail();
  }, [email]);
  useEffect(() => {
    // Fetch notifications and count unread notifications
    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${email}/Customer`
        );
        const notificationsData = await notificationsResponse.json();

        // Count unread notifications
        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByCustomer
        );

        // Update notification count state
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on component mount
    fetchNotifications();
  }, [notificationCount, email]); // Run only on component mount
  useEffect(() => {
    // Fetch cart details and update Redux store
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-cart/${contactNumberCustomer}`
        );
        const data = await response.json();
        if (data.success) {
          console.log(data.cartDetails)
          data.cartDetails.forEach((product) => {
           // console.log(product)
            dispatch(addToCart(product));
          });
        }
      } catch (error) {
        console.log("Error fetching cart details:", error);
      }
    };

    if (!isFirstRender.current) {
      fetchCartDetails();
    } else {
      isFirstRender.current = false;
    }
  }, [contactNumberCustomer, isFirstRender]);
  useEffect(() => {
    // Add a back button listener to handle back key press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    // Clean up the back button listener when the component unmounts
    return () => backHandler.remove();
  }, [handleBackPress]);
  const handleBackPress = useCallback(() => {
    // If the search query is not empty, handle backspace to update the filtered list
    if (searchQuery.length > 0) {
      const newQuery = searchQuery.slice(0, -1); // Remove the last character
      setSearchQuery(newQuery);

      // Update filtered stores based on the new query
      const filterStores = originalStores.filter((store) =>
        store.storeName.toLowerCase().includes(newQuery.toLowerCase())
      );
      setFilteredStores(filterStores);

      return true; // Prevent default back action
    }
    return false; // Allow default back action
  }, [searchQuery, originalStores]);

  const handleStoreTypeChange = (type) => {
    setSelectedStoreType(type);

    // Update filtered stores based on the selected store type
    const storesToFilter = Array.isArray(originalStores) ? originalStores : [];
    const filterStores = storesToFilter.filter(
      (store) => type === "All" || store.storeType === type
    );

    setFilteredStores(filterStores);
    setStoresFound(false);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);

    const filterStores = originalStores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(query.toLowerCase()) &&
        (selectedStoreType === "All" || store.storeType === selectedStoreType)
    );
    setFilteredStores(filterStores);
  };
  const handleStoreCardPress = async (store) => {
    try {
      // Fetch all products for the selected store
      const response = await fetch(
        `http://${IP_ADDRESS}:5000/products/${store.storeID}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching products for store ${store.storeID}`);
      }

      const products = await response.json();
      // Navigate to the StoreDetailsScreen with the selected store data and products
      navigation.navigate("StoreDetails", {
        store,
        products,
        contactNum: contactNumberCustomer,
      });
    } catch (error) {
      console.log("Error in handleStoreCardPress:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };
  const handleNotificationsClick = async () => {
    try {

      // Update notifications as opened for the customer
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications/${emailUser}/Customer`,
        {
          method: "PUT",
        }
      );
      if (updateNotificationsResponse.ok) {
        // Set notification count to 0
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${emailUser}/Customer`
        );
        const notificationsData = await notificationsResponse.json();

        // Update notification count state
        setNotificationCount(0);

        // Update the state with notifications data
        setNotifications(notificationsData);
        setShowNotifications(true);
      } else {
        console.log("Error updating notifications");
      }
    } catch (error) {
      console.log("Error handling notifications click:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Customize status bar color */}
      <StatusBar
        backgroundColor="#25d366"
        barStyle="light-content"
        translucent={true}
        height={20}
      />

      {/* Appbar/Header */}
      <Appbar.Header>
        <Menubar navigation={navigation}></Menubar>
        {!isMapViewVisible ? (
          <Searchbar
            placeholder="Search stores..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={{
              flex: 1,
              backgroundColor: "transparent",
              elevation: 0,
              display: isMapViewVisible ? "none" : "flex",
            }}
            inputStyle={{ color: "black" }}
          />
        ) : (
          <Appbar.Content title="RuralMed" style={{ alignItems: "center" }} />
        )}
        {showNotifications && (
          <NotificationsDisplay
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
        <Badge
          visible={notificationCount > 0}
          size={23}
          style={{
            position: "absolute",
            top: 8,
            right: 55, // Adjust the position as needed
            backgroundColor: "#25d366",
            color: "black",
          }}
        >
          {notificationCount}
        </Badge>
        <Badge
          visible={cartCount > 0}
          size={23}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#25d366",
            color: "black",
          }}
        >
          {cartCount}
        </Badge>
        {!isMapViewVisible ? (
          <Appbar.Action icon="bell" onPress={handleNotificationsClick} />
        ) : (
          ""
        )}
        <Appbar.Action
          icon="cart"
          onPress={() =>
            navigation.navigate("CartScreen", {
              contactNum: contactNumberCustomer,
            })
          }
        />
      </Appbar.Header>
      <FAB
        label="Get Help"
        size="large"
        color="white"
        style={{
          position: "absolute",
          margin: 6,
          right: 0,
          paddingLeft:10,
          paddingRight:10,
          bottom: isMapViewVisible ? windowHeight * 0 : 0,
          backgroundColor: "#25d366",
          zIndex: 1,
        }}
        onPress={() => {
          navigation.navigate("ChatScreen");
        }}></FAB>
  <Stores
          handleStoreCardPress={handleStoreCardPress}
          handleStoreTypeChange={handleStoreTypeChange}
          selectedStoreType={selectedStoreType}
          isLoading={isLoading}
          filteredStores={filteredStores}
          emailUser={emailUser}
          contactNumberCustomer={contactNumberCustomer}
          locationNames={locationNames}
          storesFound={storesFound}
          navigation={navigation}
        />     
    
      </View>
  );
};
export default CustomerHomeScreen;
