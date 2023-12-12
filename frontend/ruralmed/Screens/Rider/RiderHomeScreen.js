import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Switch,
  ActivityIndicator,
} from "react-native";
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Menu,
  Badge,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeaderRider from "../../Components/RiderAppHeader";
import IP_ADDRESS from "../../config/config";

const RiderHomeScreen = ({ navigation }) => {
  const [availabilitySwitch, setAvailabilitySwitch] = useState(false);
  const [riderEmail, setRiderEmail] = useState("");
  const [isNotificationsModalVisible, setNotificationsModalVisible] =
    useState(false);
  const [notificationsData, setNotificationsData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [prevMonthEarning, setPrevMonthEarning] = useState(0);
  const [prevMonthOrders, setPrevMonthOrders] = useState(0);
  const [currentMonthEarning, setCurrentMonthEarning] = useState(0);
  const [currentMonthOrders, setCurrentMonthOrders] = useState(0);
  const [inProgressOrders, setInProgressOrders] = useState(0);

  useEffect(() => {
    const fetchRiderData = async () => {
      try {
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
        const statsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/rider-monthly-stats/${email}`
        );
        const statsData = await statsResponse.json();
        setPrevMonthEarning(statsData.prevMonthEarning);
        setPrevMonthOrders(statsData.prevMonthOrders);
        setCurrentMonthEarning(statsData.currentMonthEarning);
        setCurrentMonthOrders(statsData.currentMonthOrders);
        setInProgressOrders(statsData.inProgressOrders);

        setRiderEmail(email);

        const profileResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-profile/${email}`
        );
        const { rider } = await profileResponse.json();

        if (rider && rider.availabilityStatus === "Online") {
          setAvailabilitySwitch(true);
        } else if (rider && rider.availabilityStatus === "Offline") {
          setAvailabilitySwitch(false);
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching rider data:", error);
        setLoading(false); // Set loading to false on error as well
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchRiderData();
  }, []);

  const updateAvailabilityStatus = async (status) => {
    try {
      const updateStatusResponse = await fetch(
        `http://${IP_ADDRESS}:5000/${riderEmail}/${status}`,
        {
          method: "PUT",
        }
      );

      if (updateStatusResponse.ok) {
        console.log(`Availability status updated to ${status}`);
      } else {
        console.error("Error updating availability status");
      }
    } catch (error) {
      console.error("Error updating availability status:", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#25d366" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeaderRider navigation={navigation} />

      {/* Monthly Dashboard Heading */}
      <View style={{ padding: 16, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          Your Monthly Dashboard
        </Title>
      </View>
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 18 }}>
          Availability Status
        </Title>
        <Switch
          value={availabilitySwitch}
          onValueChange={(value) => {
            setAvailabilitySwitch(value);
            const status = value ? "Online" : "Offline";
            updateAvailabilityStatus(status);
          }}
          style={{ marginLeft: "45%" }}
          thumbColor={availabilitySwitch ? "#25d366" : "#9E9E9E"}
        />
      </View>
      {/* Dashboard Items */}
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

export default RiderHomeScreen;
