import useFetchEmail from "../../../utils/useFetchEmail";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import OptionBar from "./Components/OptionBar";
import { selectCartCount } from "../../../Components/Cart/CartSelector";
import {
  View,
  StatusBar,
  BackHandler,
} from "react-native";
import { Badge, Appbar, Searchbar, FAB} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import IP_ADDRESS from "../../../config/config";
import { addToCart } from "../../../Components/Cart/CartSlice";
import NotificationsDisplay from "../../../Components/Customer/NotificationsDisplay";
import Menubar from "./Components/Menubar";
import Chips from "./Components/Chips";
import { styles } from "./styles";
import Stores from "./Components/customerStores";
import CustomerDvms from "./Components/customerDvms";
const CustomerHomeScreen = ({ navigation }) => {
  const email = useFetchEmail();
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState('Browse Stores');
  const [searchQuery, setSearchQuery] = useState("");
  const [isMapViewVisible, setMapViewVisible] = useState(false);
  const [selectedStoreType, setSelectedStoreType] = useState("All");
  const [locationNames, setLocationNames] = useState({}); // New state to store location names
  const [isLoading, setIsLoading] = useState(true);
  const [storesFound, setStoresFound] = useState(true);
  const isFirstRender = useRef(true);
  const [notifications, setNotifications] = useState([]);
  const cartCount = useSelector(selectCartCount);
  const [contactNumberCustomer, setContactNumber] = useState("");
  const [originalStores, setOriginalStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [emailUser, setEmailUser] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filteredCardsData, setFilteredCardsData] = useState([]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    // Handle navigation or rendering of corresponding component based on the selected option
  };
  useEffect(() => {}, [email]);
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
        fetch(`http://${IP_ADDRESS}:5000/get-stores/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((stores) => {
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
    const fetchNotifications = async () => {
      try {
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${email}/Customer`
        );
        const notificationsData = await notificationsResponse.json();
        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByCustomer
        );
        const meetingsNotificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-meeting-notifications/${email}`
        );
        const meetingNotificationsData = await meetingsNotificationsResponse.json();
        const meetingUnreadNotifications = meetingNotificationsData.filter(
          (notification) => !notification.isOpenedByCustomer
        );
        
       setNotificationCount(unreadNotifications.length+meetingUnreadNotifications.length)
         } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [notificationCount, email]); // Run only on component mount
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-cart/${contactNumberCustomer}`
        );
        const data = await response.json();
        if (data.success)
          data.cartDetails.forEach((product) => {
            dispatch(addToCart(product));
          });
      } catch (error) {
        console.log("Error fetching cart details:", error);
      }
    };
    if (!isFirstRender.current) fetchCartDetails();
    else isFirstRender.current = false;
  }, [contactNumberCustomer, isFirstRender]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [handleBackPress]);
  const handleBackPress = useCallback(() => {
    if (searchQuery.length > 0) {
      const newQuery = searchQuery.slice(0, -1); // Remove the last character
      setSearchQuery(newQuery);
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
    const storesToFilter = Array.isArray(originalStores) ? originalStores : [];
    const filterStores = storesToFilter.filter(
      (store) => type === "All" || store.storeType === type
    );
    setFilteredStores(filterStores);
    setStoresFound(false);
  };
  const handleSearch = (query) => {
    if(selectedOption=="Browse Stores"){
    setSearchQuery(query);

    const filterStores = originalStores.filter(
      (store) =>
        store.storeName.toLowerCase().includes(query.toLowerCase()) &&
        (selectedStoreType === "All" || store.storeType === selectedStoreType)
    );
    setFilteredStores(filterStores);
    }
    else{

    }
  };
  const handleStoreCardPress = async (store) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:5000/products/${store.storeID}`
      );
      if (!response.ok)
        throw new Error(`Error fetching products for store ${store.storeID}`);
      const products = await response.json();
      const enabledProducts = products.filter(product => product.has_enabled);

      navigation.navigate("StoreDetails", {
        store,
        products:enabledProducts,
        contactNum: contactNumberCustomer,
      });
    } catch (error) {
      console.log("Error in handleStoreCardPress:", error);
    }
  };
  const handleNotificationsClick = async () => {
    try {
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications/${emailUser}/Customer`,
        {
          method: "PUT",
        }
      );
      if (updateNotificationsResponse.ok) {
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${emailUser}/Customer`
        );
        const notificationsData = await notificationsResponse.json();
        setShowNotifications(true);

        //
      const updateMeetingNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications-meeting/${emailUser}/Customer`,
        {
          method: "PUT",
        }
      );
      if (updateMeetingNotificationsResponse.ok) {
        const meetingNotificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-meeting-notifications/${emailUser}`
        );
        const meetingNotificationsData = await meetingNotificationsResponse.json();
        console.log(meetingNotificationsData,notificationsData)
        setNotificationCount(0);
        const notificationsArray = [...meetingNotificationsData, ...notificationsData];

          console.log(notificationsArray)
      // Set the notifications with the array
      setNotifications(notificationsArray);
        setShowNotifications(true);
      }} else console.log("Error updating notifications");
    } catch (error) {
      console.log("Error handling notifications click:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#25d366" />
      <Appbar.Header style={styles.appbarHeader}>
        <Menubar navigation={navigation}></Menubar>
        {!isMapViewVisible && selectedOption==="Browse Stores" ? (
          <Searchbar
            placeholder={selectedOption=="Browse Stores"?"Search stores...":"Search DVMs..."}
            onChangeText={handleSearch}
            value={searchQuery}
            style={[
              {
                display: isMapViewVisible ? "none" : "flex",
              },
              styles.searchbar,
            ]}
            inputStyle={styles.searchInput}
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
        <Badge visible={notificationCount > 0} size={23} style={styles.notBadge} >
          {notificationCount}
        </Badge>
        <Badge visible={cartCount > 0} style={styles.badge} size={23}>
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
        icon="help"
        size="mediu"
        color="white"
        style={styles.fab}
        onPress={() => {
          navigation.navigate("ChatScreen");
        }}
      /> 
      <View style={{marginTop:6}}>
      
      </View>
      {selectedOption === "Browse Stores" ? (
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
      ) : (
<CustomerDvms navigation={navigation} ></CustomerDvms>
)}      
 <OptionBar selectedOption={selectedOption} onSelectOption={handleSelectOption} />

         </View>
  );
};
export default CustomerHomeScreen;
