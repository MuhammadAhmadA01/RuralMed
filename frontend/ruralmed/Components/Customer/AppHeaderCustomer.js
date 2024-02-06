// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { Appbar, Menu, Badge } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";
import NotificationsDisplay from "./NotificationsDisplay";
import MenuCustomer from "./Menu";
import useNotifications from "../../utils/useNotifications";
const AppHeaderCustomer = ({ navigation }) => {
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const {notificationCount, notifications, email}=useNotifications()
  const [notificationsCount,setNotificationsCount]=useState(notificationCount)
  
  const handleNotificationsClick = async () => {
    try {
      console.log(email)
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications/${email}/Customer`,
        {
          method: "PUT",
        }
      );

      if (updateNotificationsResponse.ok) {
        // Set notification count to 0
        setNotificationsCount(notificationCount);
        setShowNotifications(true);
        // Show the notifications modal
        setNotificationsModalVisible(true);
      } else {
        console.error("Error updating notifications");
      }
    } catch (error) {
      console.error("Error handling notifications click:", error);
    }
  };
  return (
    <>
      {/* Appbar/Header */}
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        {/* Menu */}
<MenuCustomer navigation={navigation}></MenuCustomer>
        {/* Appbar Content */}
        <Appbar.Content title="RuralMed" style={{ alignItems: "center" }} />

        {/* Bell Icon */}
        <Appbar.Action
          icon="bell"
          onPress={() => {
            handleNotificationsClick();
          }}
        />
{showNotifications && (
          <NotificationsDisplay
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
        
        {/* Badge for Notification Count */}
        <Badge
          visible={notificationsCount > 0}
          size={23}
          style={{
            position: "absolute",
            top: 8,
            right: 5,
            backgroundColor: "white",
            color: "black",
          }}
        >
          {notificationsCount}
        </Badge>
      </Appbar.Header>

    </>
  );
};

export default AppHeaderCustomer;
