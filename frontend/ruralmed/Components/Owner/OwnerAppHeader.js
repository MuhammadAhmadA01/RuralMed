// AppHeader.js
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { Appbar, Menu, Badge } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationsDisplay from "../User/NotificationDisplay";
import IP_ADDRESS from "../../config/config";
const AppHeader = ({ navigation, isHome }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [email, setEmail] = useState("");
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  useEffect(() => {
    const fetchOwnerNotifications = async () => {
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
          `http://${IP_ADDRESS}:5000/notifications/${emailData.email}/Owner`
        );
        const notificationsData = await notifications.json();

        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByOwner
        );
        setNotificationCount(unreadNotifications.length);
        setNotificationsData(notificationsData);
      } catch (error) {
        console.error("Error fetching owner notifications:", error);
      }
    };

    fetchOwnerNotifications();
  }, []);

  const handleNotificationsClick = async () => {
    try {
      // Fetch email data
      // Update notifications as opened for the customer
      const updateNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-notifications/${email}/Owner`,
        {
          method: "PUT",
        }
      );

      if (updateNotificationsResponse.ok) {
        // Set notification count to 0 using the prop function
        setNotificationCount(0);
        setNotificationsModalVisible(true);
      } else {
        console.error("Error updating notifications");
      }
    } catch (error) {
      console.error("Error handling notifications click:", error);
    }
  };
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

  return (
    <>
      <StatusBar backgroundColor="#25d366" barStyle="light-content" />
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          style={{ marginTop: "2%", width: "50%", height: "30%" }}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          <Menu.Item
            title="MENU"
            style={{ alignItems: "center", marginLeft: "12%" }}
            titleStyle={{ fontSize: 18, fontWeight: "bold" }}
          />
              <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => { setMenuVisible(false);navigation.replace('ViewProfile',{role:'Owner'})}}
            title="My Profile"
          />
      <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("OwnerAllStoreScreen");
            }}
            title="My Stores"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "5%" }}
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate("AllOrdersScreen",{role:"owner"});
            }}
            title="My Orders"
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "3%" }}
            onPress={() => {
              setMenuVisible(false);

              navigation.replace("OwnerAddProductScreen");
            }}
            title="Add Product "
          />
          <Menu.Item
            style={{ alignItems: "center", paddingLeft: "17%" }}
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>
        <Appbar.Content title="RuralMed" style={{ alignItems: "center", marginLeft:isHome?0:50 }} />
        {!isHome && <Appbar.Action
      icon="home"
      onPress={() => {
        navigation.navigate('HomeOwner');
      }}
    />
}
    
        <Appbar.Action
          icon="bell"
          onPress={() => {
            handleNotificationsClick();
          }}
        />
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
        role="Owner"
        navigation={navigation}
      />
    </>
  );
};

export default AppHeader;
