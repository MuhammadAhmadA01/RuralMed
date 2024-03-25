import React, { useState, useEffect } from "react";
import styles from "./styles/styles";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Chip, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../../config/config";
import useFetchEmail from "../../../utils/useFetchEmail";
import AppHeaderCustomer from "../../../Components/Customer/AppHeaderCustomer";

const CustomerAllOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const email=useFetchEmail();
  useEffect(() => {
    const fetchData = async () => {
      try {
   
        const id = email;
        const ordersResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-customers-orders/${id}`
        );

        if (!ordersResponse.ok) {
          throw new Error("Error fetching orders");
        }
        const ordersData = await ordersResponse.json();

        // Sort orders based on dateOfOrder in descending order
        const sortedOrders = ordersData.sort(
          (a, b) => new Date(b.dateOfOrder) - new Date(a.dateOfOrder)
        );

        setOrders(sortedOrders);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status.toLowerCase());
  };

  const handleCardPress = (orderID) => {
    console.log("Clicked on order:", orderID);
  };
  
const parseOrderDate = (dateString) => {
  const orderDate = new Date(dateString);

  // Format the date (e.g., "2023-12-14")
  const date = orderDate.toISOString().split("T")[0];

  // Format the time (e.g., "14:16:44")
  const time = orderDate.toISOString().split("T")[1].split(".")[0];

  // Format the time in 12-hour format with AM/PM (e.g., "02:16 PM")
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    date,
    time,
    formattedTime,
  };
};
const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "#25d366"; // Green color for completed
    case "in-progress":
      return "red"; // Red color for in-progress
    case "picked":
      return "green"; // Black color for picked
    default:
      return "black"; // Default to black for other statuses
  }
}

  const renderOrderCards = () => {
    const filteredOrders = filterOrdersByStatus();
  
    return filteredOrders.map((order) => (
      <TouchableOpacity
        key={order.orderID}
        onPress={() => handleCardPress(order.orderID)}
      >
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            <Title>Order # {order.orderID}</Title>
            <Text>Date: {parseOrderDate(order.dateOfOrder).date}</Text>
            <Text>Time: {parseOrderDate(order.dateOfOrder).formattedTime}</Text>
        
            <Text style={{ color: getStatusColor(order.orderStatus) }}>
              Status: {order.orderStatus}
            </Text>
          </Card.Content>
          {order.orderStatus === "completed" && (
            <View>
              {order.hasReviewed ? (
                <Text style={[styles.reviewButton,{backgroundColor:"#888888"}]}>Reviewed</Text>
              ) : (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => {
                    console.log('aim');
                    navigation.replace("RateScreen", { order: order });
                  }}
                >
                  <Text style={{ color: "white" }}>Review</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    ));
  };
  

  const filterOrdersByStatus = () => {
    if (selectedStatus === "all") {
      return orders;
    } else {
      return orders.filter((order) => order.orderStatus === selectedStatus);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeaderCustomer isProfile={true}  navigation={navigation}></AppHeaderCustomer>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          All Your Orders
        </Title>
      </View>

      <Title
        style={{
          marginLeft: "3%",
          color: "#25d366",
          fontWeight: "700",
          marginTop: "2%",
        }}
      >
        Select by Status
      </Title>

      <View style={styles.chipContainer}>
        {["All", "In-Progress", "Picked", "Completed"].map((status) => (
          <Chip
            key={status}
            mode={selectedStatus === status.toLowerCase() ? "outlined" : "flat"}
            onPress={() => handleStatusChange(status)}
            style={{
              backgroundColor:
                selectedStatus === status.toLowerCase()
                  ? "transparent"
                  : "#25d366",
              borderColor:
                selectedStatus === status.toLowerCase()
                  ? "#25d366"
                  : "transparent",
              borderWidth: 1,
              borderRadius:50,
              padding:3
            }}
            textStyle={{
              color:
                selectedStatus === status.toLowerCase() ? "#25d366" : "white",
            }}
          >
            {status}
          </Chip>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {isLoading || !email ? (
          <ActivityIndicator size="large" color="#25d366" margin={200} />
        ) : (
          renderOrderCards()
        )}
      </ScrollView>

    </View>
  );
};
export default CustomerAllOrders;