import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AppHeaderOwner from "../../Components/OwnerAppHeader";
import { Card, Title, Chip, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";

const OwnerOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactNumber = await AsyncStorage.getItem("phone");
        const response = await fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactNumber }),
        });

        if (!response.ok) {
          throw new Error("Error fetching email");
        }

        const data = await response.json();

        const email = data.email;
        const ordersResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-owner-orders/${email}`
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
  }, []);

  const handleStatusChange = (status) => {
    setSelectedStatus(status.toLowerCase());
  };
  const parseOrderDate = (dateString) => {
    const orderDate = new Date(dateString);
    
    // Format the date (e.g., "2023-12-14")
    const date = orderDate.toISOString().split('T')[0];
  
    // Format the time (e.g., "14:16:44")
    const time = orderDate.toISOString().split('T')[1].split('.')[0];
  
    // Format the time in 12-hour format with AM/PM (e.g., "02:16 PM")
    const formattedTime = orderDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  
    return {
      date,
      time,
      formattedTime,
    };
  };

  const handleCardPress = (orderID) => {
    console.log("Clicked on order:", orderID);
  };

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
            <Text>Status: {order.orderStatus}</Text>
          </Card.Content>
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
      <AppHeaderOwner navigation={navigation}></AppHeaderOwner>
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
        {isLoading ? (
          <ActivityIndicator size="large" color="#25d366" margin={200} />
        ) : (
          renderOrderCards()
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => navigation.replace("HomeOwner")}
        style={styles.bottomButton}
      >
        Go to Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chipContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  chip: {
    backgroundColor: "#25d366",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
  },
  bottomButton: {
    marginVertical: 16,
    backgroundColor: "#25d366",
  },
});

export default OwnerOrdersScreen;
