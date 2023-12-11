import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Appbar, Button, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../config/config";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const PrescriptionPlaceOrderScreen = ({ navigation, route }) => {
  const { contactNumber, store, switchOn } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [riderDistances, setRiderDistances] = useState({});
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");

  const [assignedRider, setAssignedRider] = useState({});
  const [customerEmail, setCustomerEmail] = useState("");
  const [riderDetails, setRiderDetails] = useState({});

  const calculateEstimatedDeliveryTime = () => {
    const storeEndTime = moment(store.endTime, "HH:mm");
    const currentMoment = moment();

    if (currentMoment.isAfter(storeEndTime)) {
      return storeEndTime
        .add(1, "day")
        .subtract(1, "hour")
        .format("MMMM DD, YYYY hh:mm A");
    } else {
      return storeEndTime.subtract(1, "hour").format("MMMM DD, YYYY hh:mm A");
    }
  };
  const fetchRiderDistances = async () => {
    setLoading(true);

    try {
      const ridersString = await AsyncStorage.getItem("riders");
      const riderEmailsArray = ridersString.split(",");

      const [longitude, latitude] = store.store_address
        .split(",")
        .map(parseFloat);
      const requests = riderEmailsArray.map(async (riderEmail) => {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-distance-of-rider/${riderEmail}/${latitude}/${longitude}`
        );
        const data = await response.json();
        return { email: riderEmail, distance: data.distance, fee: data.fee };
      });

      const results = await Promise.all(requests);

      // Filter out results with errors (e.g., no rider found)
      const validResults = results.filter((result) => !result.error);

      if (validResults.length > 0) {
        const minDistanceRider = validResults.reduce((min, result) =>
          result.distance < min.distance ? result : min
        );

        // Store distances in state
        setRiderDistances(
          validResults.reduce((acc, result) => {
            acc[result.email] = result.distance;
            return acc;
          }, {})
        );

        console.log("Minimum Distance Rider:", minDistanceRider);
        setAssignedRider(minDistanceRider);
      }
    } catch (error) {
      console.error("Error fetching rider distances:", error);
    } finally {
      const fetchData = async () => {
        try {
          console.log(assignedRider)
          const response = await fetch(

            `http://${IP_ADDRESS}:5000/get-user-profile/${assignedRider.email}`
          );
          const userData = await response.json();
          console.log(userData)
        } catch (error) {
          console.error("Error fetching rider details:", error);
        } finally {
          setRiderDetails(userData);
       
          setLoading(false);
        }
      };

      fetchData();
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    console.log(contactNumber);
    const customerEmailResponse = await fetch(
      `http://${IP_ADDRESS}:5000/get-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactNumber }),
      }
    );
    const customerEmailData = await customerEmailResponse.json();
    console.log(customerEmailData.email);
    setCustomerEmail(customerEmailData.email);

    // Your prescription image link from route.params
    const prescriptionLink = route.params.prescriptionLink;
    console.log(prescriptionLink);
    // Create an array with prescription link as an object
    const orderDetails = [{ prescriptionLink }];
      console.log(switchOn)
    const orderData = {
      customerID: customerEmailData.email,
      riderId: assignedRider.email,
      ownerId: store.ownerEmail,
      shippingCharges: assignedRider.fee,
      orderStatus: "in-progress",
      isPrescription: true,
      orderDetails: orderDetails,
      storeId: store.storeID,
      isIdentityHidden:switchOn
    };

    try {
      const response = await fetch(`http://${IP_ADDRESS}:5000/place-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear the cart in Redux store and Cart table
        const newOrder = await response.json();
        setLoading(false);

        // Now that the place order request is completed, make the notification request
        const notificationData = {
          orderID: newOrder.orderID,
          riderId: assignedRider.email,
          ownerId: store.ownerEmail,
          customerId: customerEmailData.email,
          dateOfNotiifcation: new Date().toLocaleString()
        };

        const notificationResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationData),
          }
        );

        if (notificationResponse.ok) {
          console.log("Notification added successfully");
          navigation.replace("HomeCustomer");
        } else {
          throw new Error("Failed to add notification");
        }
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderDistances();
    setEstimatedDeliveryTime(calculateEstimatedDeliveryTime());
  }, []); // Run only on component mount

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar/Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Order Details" />
      </Appbar.Header>

      <Title style={styles.orderDetailsTitle}>Your Prescription</Title>
      {/* Prescription Image */}
      <View style={styles.prescriptionImageContainer}>
        <Image
          style={styles.prescriptionImage}
          source={{
            uri: "https://res.cloudinary.com/dvb3iz47x/image/upload/v1702076961/cus11%40gmail.com_prescription.jpg",
          }}
        />
      </View>
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25d366" />
          <Text style={styles.loadingText}>Checking Rider's availability</Text>
        </View>
      )}

      {/* Rider Details */}
      {!loading && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Rider: {`${riderDetails.firstName} ${riderDetails.lastName}`}
          </Text>
          <Text style={styles.subtotalText}>
            Estimated Delivery Time: {calculateEstimatedDeliveryTime()}
          </Text>
          <Text
            style={styles.subtotalText}
          >{`Rider Contact: ${riderDetails.contactNumber}`}</Text>

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
      )}
      {/* Shipping Fee */}
      {!loading && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Shipping Fee: ${assignedRider.fee}
          </Text>
        </View>
      )}

      {/* Order Total */}
      {!loading && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Order Total: Will be informed by store owner
          </Text>
        </View>
      )}

      {/* Place Order Button */}
      {!loading && (
        <Button
          mode="contained"
          style={styles.checkoutButton}
          onPress={placeOrder}
        >
          Place Order
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Style definitions for the CheckoutScreen
  // Style definitions for the CheckoutScreen
  orderDetailsTitle: {
    marginLeft: "3%",
    color: "#25d366",
    fontWeight: "700",
    marginTop: "2%",
  },
  prescriptionImageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  prescriptionImage: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: "contain",
  },
  subtotalContainer: {
    margin: 10,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    margin: 16,
    backgroundColor: "#25d366",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  dialerButton: {
    marginTop: 10,
    backgroundColor: "#25d366",
  },
});

export default PrescriptionPlaceOrderScreen;
