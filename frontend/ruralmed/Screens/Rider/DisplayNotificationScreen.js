import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import IP_ADDRESS from "../../config/config";
import AppHeaderRider from "../../Components/RiderAppHeader"; // Replace 'path-to-AppHeaderRider' with the actual path
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../Components/ProductCard";
import AppHeader from "../../Components/OwnerAppHeader";
const windowWidth = Dimensions.get("window").width;

// RiderOrderDetailScreen component
const NotificationOrderDetailScreen = ({ route, navigation }) => {
  const { orderID, role } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [riderDetails, setRiderDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [customerLat, setCustomerLat] = useState("");
  const [customerLong, setCustomerLong] = useState("");
  const [storeLat, setStoreLat] = useState("");
  const [storeLong, setStoreLong] = useState("");

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderResponse = await fetch(
          `http://${IP_ADDRESS}:5000/order/${orderID}`
        );
        const orderData = await orderResponse.json();

        setOrderDetails(orderData.order);

        if (role === "Rider") {
          // Fetch customer details
          const customerResponse = await fetch(
            `http://${IP_ADDRESS}:5000/get-user-profile/${orderData.order.customerID}`
          );
          const customerData = await customerResponse.json();
          setCustomerDetails(customerData);
          const [longitude, latitude] = customerData.address
            .split(",")
            .map(parseFloat);
          setCustomerLong(longitude);
          setCustomerLat(latitude);
          // Fetch store details
          const storeResponse = await fetch(
            `http://${IP_ADDRESS}:5000/get-a-store/${orderData.order.storeId}`
          );
          const storeData = await storeResponse.json();
          setStoreDetails(storeData.store);
          console.log(storeDetails, "asasksnwin");
          const [long, lat] = storeData.store.store_address
            .split(",")
            .map(parseFloat);
          setStoreLong(long);
          setStoreLat(lat);
        } else {
          const riderResponse = await fetch(
            `http://${IP_ADDRESS}:5000/get-user-profile/${orderData.order.riderId}`
          );
          const riderData = await riderResponse.json();
          console.log(riderData);
          setRiderDetails(riderData);
        }
        // Fetch product details for each product in order
        if (!orderData.order.isPrescription) {
          const productDetailsPromises = orderData.order.orderDetails.map(
            async (product) => {
              const productResponse = await fetch(
                `http://${IP_ADDRESS}:5000/product/${product.prodId}`
              );
              const productData = await productResponse.json();
              return { ...product, productDetails: productData.product };
            }
          );

          // Wait for all product details to be fetched
          const productDetails = await Promise.all(productDetailsPromises);
          // Update order details with product details
          setOrderDetails((prevOrderDetails) => ({
            ...prevOrderDetails,
            orderDetails: productDetails,
          }));
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const handleMarkAsCompleted = () => {
    // Implement logic to mark the order as completed
    console.log("Order marked as completed!");
  };
  const hanldeMarkAsPicked = () => {
    console.log("picked");
  };
  const openGoogleMaps = (lat, long) => {
    // Create a URL with the coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;

    // Open the URL using Linking
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25d366" />

        <Text>Loading Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {role === "Rider" ? (
        <AppHeaderRider navigation={navigation} />
      ) : (
        <AppHeader navigation={navigation}></AppHeader>
      )}

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.heading}>
            {orderDetails.isPrescription
              ? "Prescription Image"
              : "Items to be Picked"}
          </Text>
          {orderDetails.isPrescription ? (
            <>
              <Image
                style={styles.prescriptionImage}
                source={{ uri: orderDetails.orderDetails[0].prescriptionLink }}
              />
            </>
          ) : (
            // Display items
            orderDetails.orderDetails.map((product) => (
              <ProductCard key={product.prodId} product={product} />
            ))
          )}
        </View>
        {role === "Owner" && (
          <View style={styles.section}>
            <Text style={styles.heading}>Rider Details</Text>
            <Text
              style={{ fontSize: 18 }}
            >{`Name: ${riderDetails.firstName} ${riderDetails.lastName}`}</Text>
            <Text
              style={{ fontSize: 18 }}
            >{`Contact #: ${riderDetails.contactNumber}`}</Text>
          </View>
        )}
        {/* Customer Details */}
        {role === "Rider" && (
          <View style={styles.section}>
            {!orderDetails.isIdentityHidden ? (
              <>
                <Text style={styles.heading}>Customer: </Text>
                <Text
                  style={{ fontSize: 18 }}
                >{`Name: ${customerDetails.firstName} ${customerDetails.lastName}`}</Text>
                <Text
                  style={{ fontSize: 18 }}
                >{`Contact #: ${customerDetails.contactNumber} `}</Text>
                <TouchableOpacity
                  onPress={() => openGoogleMaps(customerLat, customerLong)}
                >
                  <Text style={{ fontSize: 20, color: "#25d366" }}>
                    <Ionicons
                      name="location-sharp"
                      size={25}
                      color="#25d366"
                      style={styles.icon}
                    />
                    Customer's Location
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.heading}>
                  Anonymous Customer. Please contact support for inquiries
                  +923017088962
                </Text>
                <TouchableOpacity
                  onPress={() => openGoogleMaps(customerLat, customerLong)}
                >
                  <Text style={{ fontSize: 18, color: "#25d366" }}>
                    <Ionicons
                      name="location-sharp"
                      size={25}
                      color="#25d366"
                      style={styles.icon}
                    />
                    Customer's Location
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        {role === "Rider" && (
          <View style={styles.section}>
            <Text style={styles.heading}>To be Picked From</Text>
            <Text
              style={{ fontSize: 18 }}
            >{`Name: ${storeDetails.storeName}`}</Text>
            <Text
              style={{ fontSize: 18 }}
            >{`Contact: ${storeDetails.storeContact}`}</Text>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => openGoogleMaps(storeLat, storeLong)}
            >
              <Text style={{ fontSize: 18, color: "#25d366" }}>
                <Ionicons
                  name="location-sharp"
                  size={25}
                  color="#25d366"
                  style={styles.icon}
                />
                Store's Location
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Order Details */}
        <View style={styles.section}>
          <Text
            style={styles.heading}
          >{`Order Status: ${orderDetails.orderStatus}`}</Text>
          {!orderDetails.isPrescription ? (
            <>
              <Text style={{ fontSize: 18 }}>{`Order sub-total: ${
                orderDetails.orderTotal - orderDetails.shippingCharges
              }`}</Text>

              <Text
                style={{ fontSize: 18 }}
              >{`Shipping Charges: ${orderDetails.shippingCharges}`}</Text>

              <Text
                style={{ fontSize: 18 }}
              >{`Order Total: ${orderDetails.orderTotal}`}</Text>
            </>
          ) : (
            <Text
              style={{ fontSize: 18 }}
            >{`Shipping Charges: ${orderDetails.shippingCharges}`}</Text>
          )}
        </View>
      </ScrollView>

      {orderDetails.orderStatus === "in-progress" && role === "Owner" ? (
        <>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={hanldeMarkAsPicked}
          >
            <Text style={styles.signupButtonText}>Mark as Picked</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.replace(`Home${role}`)}
          >
            <Text style={styles.signupButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </>
      ) : orderDetails.orderStatus === "picked" && role === "Rider" ? (
        <>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleMarkAsCompleted}
          >
            <Text style={styles.signupButtonText}>Mark Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.replace(`Home${role}`)}
          >
            <Text style={styles.signupButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.replace(`Home${role}`)}
        >
          <Text style={styles.signupButtonText}>Go to Home</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Change background color if needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#25d366",
  },
  productDetails: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#25d366",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: "#25d366",
    borderRadius: 20,
    paddingVertical: "2%",
    //paddingHorizontal:"20%", // Use percentage for padding
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginBottom: "2%",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: windowWidth * 0.04, // Use a percentage of the window width
  },
  mapButton: {
    width: "40%",
    backgroundColor: "#25d366",
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 12,
    marginTop: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "white",
    fontSize: 16,
  },
  prescriptionImage: {
    // flex:,
    width: "80%",
    height: 200, // Set the height as needed
    borderRadius: 10,
    marginBottom: 16,
    aspectRatio: 1,
    alignSelf: "center",
  },
});

export default NotificationOrderDetailScreen;
