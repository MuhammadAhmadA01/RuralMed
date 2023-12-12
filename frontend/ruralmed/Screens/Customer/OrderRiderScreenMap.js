import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Appbar, Title, Card, Paragraph, Button } from "react-native-paper";
import moment from "moment";
import IP_ADDRESS from "../../config/config";

const OrderConfirmationScreen = ({ route, navigation }) => {
  const {
    assignedRider,
    storeEndTime,
    orderTotal,
    shippingCharges,
    orderDetails,
  } = route.params;
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [riderDetails, setRiderDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(assignedRider.email);
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-user-profile/${assignedRider.email}`
        );
        const userData = await response.json();
        setRiderDetails(userData);
        console.log(riderDetails);
      } catch (error) {
        console.error("Error fetching rider details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignedRider.email]);

  useEffect(() => {
    const storeEndTimeMoment = moment(storeEndTime, "HH:mm");
    const currentMoment = moment();

    if (currentMoment.isAfter(storeEndTimeMoment)) {
      setEstimatedDeliveryTime(
        storeEndTimeMoment
          .add(1, "day")
          .subtract(1, "hour")
          .format("MMMM DD, YYYY hh:mm A")
      );
    } else {
      setEstimatedDeliveryTime(
        storeEndTimeMoment.subtract(1, "hour").format("MMMM DD, YYYY hh:mm A")
      );
    }
  }, [storeEndTime]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25d366" />
        <Text>Loading Order Details</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar/Header */}
      <Appbar.Header>
        <Appbar.Content title="Order Confirmation" />
      </Appbar.Header>

      {/* Order Details */}
      <ScrollView>
        <Title style={styles.orderDetailsTitle}>Order Details</Title>
        {orderDetails.map((item) => (
          <Card key={item.productID} style={styles.card}>
            <Card.Content>
              <Title style={styles.productName}>{item.name}</Title>
              <Paragraph>Quantity: {item.quantity}</Paragraph>
              <Paragraph>Subtotal: ${item.subtotal}</Paragraph>
            </Card.Content>
          </Card>
        ))}

        {/* Estimated Delivery Time */}
        <View style={styles.deliveryTimeContainer}>
          <Text style={styles.deliveryTimeText}>
            Estimated Delivery Time: {estimatedDeliveryTime}
          </Text>
        </View>

        {/* Rider Details */}
        <View style={styles.riderDetailsContainer}>
          <Text style={styles.riderDetailsHeading}>Rider Details</Text>
          <Text>{`Name: ${riderDetails.firstName} ${riderDetails.lastName}`}</Text>
          <Text>Contact Number: {riderDetails.contactNumber}</Text>
          <TouchableOpacity
            onPress={() => {
              // Open phone dialer with the rider's contact number
              Linking.openURL(`tel:${riderDetails.contactNumber}`);
            }}
          >
            <Button icon="phone" mode="contained" style={styles.dialerButton}>
              Dial Rider
            </Button>
          </TouchableOpacity>
        </View>

        {/* Shipping Fee */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Shipping Fee: ${shippingCharges}
          </Text>
        </View>

        {/* Order Subtotal */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Order Subtotal: ${orderTotal}</Text>
        </View>

        {/* Actual Total */}
        <View style={styles.subtotalContainer}>
          <Text style={styles.totalText}>
            Total: ${orderTotal + shippingCharges}
          </Text>
        </View>
      </ScrollView>

      {/* Go to Home Button */}
      <TouchableOpacity
        onPress={() => {
          navigation.replace("HomeCustomer");
        }}
        style={{
          margin: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: "#f0f0f0",
        }}
      >
        <Button icon="home" mode="contained" style={styles.dialerButton}>
          Go to Home
        </Button>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  orderDetailsTitle: {
    marginLeft: "3%",
    color: "#25d366",
    fontWeight: "700",
    marginTop: "2%",
  },
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deliveryTimeContainer: {
    margin: 10,
  },
  deliveryTimeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  riderDetailsContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  riderDetailsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25d366",
    marginBottom: 10,
  },
  dialerButton: {
    marginTop: 10,
    backgroundColor: "#25d366",
  },
  subtotalContainer: {
    margin: 10,
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25d366",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#25d366",
    padding: 16,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrderConfirmationScreen;
