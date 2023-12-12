import NotificationsDisplay from "./NotificationsDisplay";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectCartCount } from "../../Components/Cart/CartSelector";
import {
  View,
  ScrollView,
  StatusBar,
  Dimensions,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Badge,
  Appbar,
  Menu,
  Searchbar,
  Snackbar,
  FAB,
  Card,
  Title,
  Paragraph,
  Chip,
  Text,
} from "react-native-paper";
import MapInputComponent from "../../Screens/MapView/MapInputComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";
import { useDispatch } from "react-redux";
import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../../Components/Cart/CartSlice";

const CustomerHomeScreen = ({ navigation }) => {
  const [cartCountInState, setCartCountInState] = useState(0);
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapViewVisible, setMapViewVisible] = useState(false);
  const [selectedStoreType, setSelectedStoreType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
        setStoresFound(false);
      } catch (error) {
        console.log("Error fetching location names:", error);
        setIsLoading(false);
        setIsDataLoading(false);
        setStoresFound(false);
      }
    };

    fetchLocationNames();

    // ... (rest of your code)
  }, [originalStores]);
  useEffect(() => {
    const getContactEmail = async () => {
      try {
        const contactNumber = await AsyncStorage.getItem("phone");
        fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactNumber }),
        })
          .then((response) => response.json())
          .then((data) => {
            setContactNumber(contactNumber);
            setEmailUser(data.email);
            // Use the email data as needed
            fetch(`http://${IP_ADDRESS}:5000/get-stores/${data.email}`, {
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
                } else {
                  setStoresFound(true);
                }
              })
              .catch((error) => {
                console.log("Error fetching stores:", error);
              });
          })
          .catch((error) => {
            console.log("Error fetching email:", error);
          });
      } catch (error) {
        console.log("Error fetching contact number:", error);
      }
    };

    getContactEmail();
  }, []);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch notifications and count unread notifications
    const fetchNotifications = async () => {
      try {
        // Fetch email data
        const contactNumber = await AsyncStorage.getItem("phone");
        const emailResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contactNumber }),
          }
        );
        const emailData = await emailResponse.json();

        // Fetch notifications for the customer
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${emailData.email}/Customer`
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
  }, [notificationCount]); // Run only on component mount

  useEffect(() => {
    // Fetch cart details and update Redux store
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-cart/${contactNumberCustomer}`
        );
        const data = await response.json();
        if (data.success) {
          data.cartDetails.forEach((product) => {
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

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleStoreTypeChange = (type) => {
    setSelectedStoreType(type);

    // Update filtered stores based on the selected store type
    const storesToFilter = Array.isArray(originalStores) ? originalStores : [];
    const filterStores = storesToFilter.filter(
      (store) => type === "All" || store.storeType === type
    );

    setFilteredStores(filterStores);
  };

  const toggleMapView = () => {
    setMapViewVisible(!isMapViewVisible);
    // Show a snackbar with the appropriate message
    setSnackbarVisible(true);
    setSnackbarMessage(
      isMapViewVisible
        ? "Click this button again to show the map"
        : "Click this button again to hide the map"
    );
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
  const handleSnackbarDismiss = () => {
    // Hide the snackbar when dismissed
    setSnackbarVisible(false);
  };

  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
    // setMapViewVisible(!isMapViewVisible)
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
      console.log(emailUser);
      // Update notifications as opened for the customer
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications/${emailUser}/Customer`,
        {
          method: "PUT",
        }
      );
      console.log(updateNotificationsResponse);
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
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          style={{ marginTop: "18%", width: "50%", height: "30%" }}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          <Menu.Item
            title="MENU"
            style={{ alignItems: "center", marginLeft: "12%" }}
            titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => console.log("Item 1")}
            title="My Profile"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => console.log("Item 2")}
            title="My Orders"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => console.log("Item 3")}
            title="My Meetings"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "3%" }}
            onPress={() => console.log("Item 4")}
            title="My Prescriptions"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "17%" }}
            onPress={async () => {
              setMenuVisible(false);
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("role");
              await AsyncStorage.removeItem("phone");

              dispatch(clearCart());
              navigation.replace("login");
            }}
            title="Logout"
          />
        </Menu>

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

      {/* FAB for Map View */}
      <FAB
        icon="map-marker"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: isMapViewVisible ? windowHeight * 0 : 0,
          backgroundColor: "#25d366",
          zIndex: 1,
        }}
        onPress={toggleMapView}
      />

      {/* Store Type Buttons */}
      <ScrollView>
        <View width="98%" marginTop={isMapViewVisible ? "0%" : "0"}>
          {isMapViewVisible && (
            <MapInputComponent
              onSelectLocation={handleLocationSelection}
            ></MapInputComponent>
          )}
        </View>

        <Title
          style={{
            marginLeft: "3%",
            color: "#25d366",
            fontWeight: "700",
            marginTop: "2%",
          }}
        >
          Categories
        </Title>

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
              onPress={() => handleStoreTypeChange(type)}
              style={{
                backgroundColor:
                  selectedStoreType === type ? "transparent" : "#25d366",
                borderColor:
                  selectedStoreType === type ? "#25d366" : "transparent",
                borderWidth: 1,
              }}
              textStyle={{
                color: selectedStoreType === type ? "#25d366" : "white",
              }}
            >
              {type}
            </Chip>
          ))}
        </View>

        <Title
          style={{ marginLeft: "3%", color: "#25d366", fontWeight: "700" }}
        >
          Featured Stores
        </Title>

        <ScrollView>
          {isLoading ? (
            <ActivityIndicator size="large" color="#25d366" margin={200} />
          ) : filteredStores.length > 0 ? (
            filteredStores.map((store, index) => (
              <TouchableOpacity
                key={store.storeID}
                onPress={() => {
                  handleStoreCardPress(store);
                }}
              >
                <Card
                  key={store.storeID}
                  style={{ margin: "2%", borderRadius: 10, overflow: "hidden" }}
                >
                  <Card.Cover
                    source={{ uri: "https://via.placeholder.com/150" }}
                  />
                  <Card.Content>
                    <Title>{store.storeName}</Title>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="location"
                        size={20}
                        color="#25d366"
                        style={{ marginRight: 8 }}
                      />
                      <Paragraph>{locationNames[index]}</Paragraph>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="call"
                        size={20}
                        color="#25d366"
                        style={{ marginRight: 8 }}
                      />
                      <Paragraph>{store.storeContact}</Paragraph>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#25d366",
                          padding: 10,
                          borderRadius: 5,
                          marginTop: 10,
                          marginLeft: "25%",
                          alignItems: "flex-end",
                        }}
                        onPress={() => {
                          console.log(emailUser);
                          navigation.replace("UploadPrescriptionScreen", {
                            email: emailUser,
                            store,
                            contactNumberCustomer,
                          });
                        }}
                      >
                        <Text style={{ color: "white" }}>
                          Upload Prescription
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ margin: "35%", fontWeight: "700" }}>
              {storesFound ? "No stores found" : "Loading stores..."}
            </Text>
          )}
        </ScrollView>
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleSnackbarDismiss}
        action={{
          label: "OK",
          onPress: handleSnackbarDismiss,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

export default CustomerHomeScreen;
