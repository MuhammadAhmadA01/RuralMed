import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import { Appbar, Card, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../Components/OwnerAppHeader";
import IP_ADDRESS from "../../config/config";

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
      <AppHeader navigation={navigation}></AppHeader>

      {/* Monthly Dashboard Heading */}
      <View style={{ padding: 16, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          Your Monthly Dashboard
        </Title>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              Current Month Earning
            </Title>
            <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
              {currentMonthEarning}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              Current Month Orders
            </Title>
            <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
              {currentMonthOrders}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              In Progress Orders
            </Title>
            <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
              {inProgressOrders}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              Prev Month Earning
            </Title>
            <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
              {prevMonthEarning}
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              Prev Month Orders
            </Title>
            <Paragraph style={{ textAlign: "center", fontSize: 20 }}>
              {prevMonthOrders}
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default OwnerHomeScreen;
