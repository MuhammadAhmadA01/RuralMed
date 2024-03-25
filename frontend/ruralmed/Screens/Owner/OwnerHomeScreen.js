import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../Components/Owner/OwnerAppHeader";
import IP_ADDRESS from "../../config/config";
import CardsView from "../../Components/User/CardsView";
const OwnerHomeScreen = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [prevMonthEarning, setPrevMonthEarning] = useState(0);
  const [prevMonthOrders, setPrevMonthOrders] = useState(0);
  const [currentMonthEarning, setCurrentMonthEarning] = useState(0);
  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [inProgressOrders, setInProgressOrders] = useState(0);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        // Fetch owner's email from AsyncStorage
        const phone = await AsyncStorage.getItem("phone");
        const emailResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contactNumber: phone,
            }),
          }
        );

        const { email } = await emailResponse.json();
        // Fetch owner monthly stats
        const statsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/owner-monthly-stats/${email}`
        );
        const statsData = await statsResponse.json();
        setPrevMonthEarning(statsData.prevMonthEarning);
        setPrevMonthOrders(statsData.prevMonthOrders);
        setCurrentMonthEarning(statsData.currentMonthEarning);
        setCurrentMonthOrders(statsData.currentMonthOrders);
        setInProgressOrders(statsData.inProgressOrders);

        // Fetch notifications and count unread notifications
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${email}/Owner`
        );
        const notificationsData = await notificationsResponse.json();

        // Count unread notifications for owner
        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByOwner
        );

        // Update notification count state
        setNotificationCount(unreadNotifications.length);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching owner data:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchOwnerData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#25d366" />
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <AppHeader isHome={true} navigation={navigation}></AppHeader>

      {/* Monthly Dashboard Heading */}
      <View style={{ padding: 16, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          Your Monthly Dashboard
        </Title>
        
      </View>
      <CardsView role='Owner' inProgressOrders={inProgressOrders} prevMonthEarning={prevMonthEarning} prevMonthOrders={prevMonthOrders} currentMonthEarning={currentMonthEarning} currentMonthOrders={currentMonthOrders} >
        </CardsView>      

    </View>
  );
};

export default OwnerHomeScreen;
