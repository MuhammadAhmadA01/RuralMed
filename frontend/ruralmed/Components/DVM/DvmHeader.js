// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { Appbar, Menu, Badge } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";
import NotificationsDisplay from "../User/NotificationDisplay";
import { StatusBar } from "react-native";

// Create the AppHeaderRider component
const AppHeaderDvm = ({ navigation }) => {
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [email, setEmail] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      setMenuVisible(false);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("phone");
      await AsyncStorage.removeItem("role");
      navigation.navigate("login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  useEffect(() => {
    const fetchDvmNotifications = async () => {
      try {
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
        setEmail(emailData.email);

        const notifications = await fetch(
          `http://${IP_ADDRESS}:5000/get-meeting-notifications/${emailData.email}`

        );
        const notificationsData = await notifications.json();

        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByDvm
        );
        setNotificationCount(unreadNotifications.length);

        setNotificationsData(notificationsData);
      } catch (error) {
        console.error("Error fetching Dvm notifications:", error);
      }
    };
    fetchDvmNotifications();
  }, []);
  const handleNotificationsClick = async () => {
    try {
      // Update notifications as opened for the rider
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications-meeting/${email}/Dvm`,
        {
          method: "PUT",
        }
      );

      if (updateNotificationsResponse.ok) {
        // Set notification count to 0
        setNotificationCount(0);
        // Show the notifications modal
        setNotificationsModalVisible(true);
        // Refetch notifications for the rider
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
      <StatusBar backgroundColor="#25d366"></StatusBar>
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        {/* Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          style={{ marginTop: "17.5%", width: "50%", height: "30%" }}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          {/* Menu Items */}
          <Menu.Item
            title="MENU"
            style={{ alignItems: "center", marginLeft: "12%" }}
            titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => { setMenuVisible(false);navigation.replace('HomeDvm')}}
            title="My Dashboard"
          />
         
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => { setMenuVisible(false);navigation.replace('ViewProfile',{role:'Dvm'})}}
            title="My Profile"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => {              navigation.navigate("AllMeetingsDvmScreen",{role:"Dvm"});
              setMenuVisible(false);
            }}
            title="My Meetings"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "17%" }}
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>

        {/* Appbar Content */}
        <Appbar.Content title="RuralMed" style={{ alignItems: "center" }} />

        {/* Bell Icon */}
        <Appbar.Action
          icon="bell"
          onPress={() => {
            handleNotificationsClick();
          }}
        />

        {/* Badge for Notification Count */}
        <Badge
          visible={notificationCount > 0}
          size={23}
          style={{
            position: "absolute",
            top: 8,
            right: 5,
            backgroundColor: "white",
            color: "black",
          }}
        >
          {notificationCount}
        </Badge>
      </Appbar.Header>
      <NotificationsDisplay
        notifications={notificationsData}
        onClose={() => setNotificationsModalVisible(false)}
        isVisible={notificationsModalVisible}
        role="Dvm"
        email={email}
        navigation={navigation}
      />
    </>
  );
};

export default AppHeaderDvm;
