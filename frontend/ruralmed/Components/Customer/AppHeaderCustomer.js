// Import necessary modules and components
import React, { useEffect, useState } from "react";
import { Appbar, Menu, Badge, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";
import NotificationsDisplay from "./NotificationsDisplay";
import MenuCustomer from "./Menu";
import useFetchEmail from "../../utils/useFetchEmail";
import { StatusBar } from "react-native";
const AppHeaderCustomer = ({ navigation,isProfile }) => {
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const email = useFetchEmail();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount, setNotificationCount] = useState(0);
  // Inside the useEffect hook of AppHeaderCustomer component

useEffect(() => {
  // Fetch notifications and count unread notifications
  const fetchNotifications = async () => {
    try {
      // Fetch notifications related to orders
      const ordersNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/notifications/${email}/Customer`
      );
      const ordersNotificationsData = await ordersNotificationsResponse.json();

      // Fetch notifications related to meetings
      const meetingsNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/get-meeting-notifications/${email}`
      );
      const meetingsNotificationsData = await meetingsNotificationsResponse.json();

      // Combine both types of notifications
      const allNotificationsData = [...ordersNotificationsData, ...meetingsNotificationsData];

      // Set the notifications data state
      setNotificationsData(allNotificationsData);

      // Count unread notifications
      const unreadNotifications = allNotificationsData.filter(
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
}, [notificationsCount, email]); // Run only on component mount


const handleNotificationsClick = async () => {
  try {
    const updateNotificationsResponse = await fetch(
      `http://${IP_ADDRESS}:5000/update-notifications/${email}/Customer`,
      {
        method: "PUT",
      }
    );
    if (updateNotificationsResponse.ok) {
      const notificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/notifications/${email}/Customer`
      );
      const notificationsData = await notificationsResponse.json();
      setShowNotifications(true);

      //
    const updateMeetingNotificationsResponse = await fetch(
      `http://${IP_ADDRESS}:5000/update-notifications-meeting/${email}/Customer`,
      {
        method: "PUT",
      }
    );
    if (updateMeetingNotificationsResponse.ok) {
      const meetingNotificationsResponse = await fetch(
        `http://${IP_ADDRESS}:5000/get-meeting-notifications/${email}`
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
    <>
    <StatusBar backgroundColor="#25d366"></StatusBar>
      {/* Appbar/Header */}
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        {/* Menu */}
<MenuCustomer navigation={navigation}></MenuCustomer>
        {/* Appbar Content */}
        
        <Appbar.Content onPress={()=>navigation.replace('ViewProfile',{role:'Customer'})} title="RuralMed" style={{ alignItems: "center", marginLeft:isProfile?50:0 }} />

        {/* Bell Icon */}
        
        <Appbar.Action
      icon="home"
      onPress={() => {
        navigation.navigate('HomeCustomer');
      }}
    />
        <Appbar.Action
          icon="bell"
          onPress={() => {
            handleNotificationsClick();
          }}
        />
{showNotifications && (
          <NotificationsDisplay
            notifications={notificationsData}
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
