import React, { useState, useEffect } from "react";
import styles from "./styles/styles";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Appbar, Button, Title, RadioButton } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../../config/config";
import { clearCart } from "../../../Components/Cart/CartSlice";
import * as ImagePicker from "expo-image-picker";

const PlaceOrderScreen = ({ navigation, route }) => {
  const { customerContact } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const storeID = useSelector((state) => state.cart.storeInfo);
  const [loading, setLoading] = useState(false);
  const [isPaymentUploaded, setIsPaymentUploaded] = useState(false); // New state variable for tracking payment upload
  const [paymentVerified, setPaymentVerified] = useState(false); // New state variable for tracking payment verification

  const [riderDistances, setRiderDistances] = useState({});
  const [assignedRider, setAssignedRider] = useState({});
  const [store, setStore] = useState({});
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to Cash on Delivery
  const [isPlaceOrderDisabled, setIsPlaceOrderDisabled] = useState(false); // New state variable

  const [paymentProofImage, setPaymentProofImage] = useState(null); // State to store the selected image

  // Function to handle uploading picture from gallery
  const handleUploadPicture = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const { uri } = result;
        const name = new Date().getTime() + "_payment";
        const type = "image/jpg";
        const newFormData = new FormData();
        newFormData.append("paymentProof", { uri, name, type });
        setPaymentProofImage(uri);
        //      setFormData(newFormData);
        setIsPaymentUploaded(true);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred during image selection. Please try again."
      );
    }
  };
  const handleVerifyPayment = () => {

      if(paymentMethod!=="COD")
      {
      const apiKey = "voLMDc1Disq5hRxNkhcHGg==5cat5sdYb3qGjkDV";
      const apiUrl = "https://api.api-ninjas.com/v1/imagetotext";
  
      const name = new Date().getTime() + "_payment";
      const type = "image/jpeg";
      const formData = new FormData();
      formData.append("image", { name, uri: paymentProofImage, type });
      
      fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "multipart/form-data",
          "X-Api-Key": apiKey,
        },
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        const currentDate = new Date();
        const extractedText = data
          .map((item) => item.text.toLowerCase())
          .join(" ");
        if (
          extractedText.includes("asiya bano") &&
          (extractedText.includes("transferred to other wallet") ||
            extractedText.includes("transaction successful money has been sent") ||
            extractedText.includes("transferred to other jazzcash")) &&
          extractedText.includes(
            calculateOrderTotal(
              calculateSubtotal(),
              assignedRider.fee
            ).toString() + ".00"
          ) &&
          (extractedText.includes("*******5512") ||
            extractedText.includes("03217645512")) &&
          extractedText.includes(
            currentDate
              .toLocaleString("default", { month: "long" })
              .toLocaleLowerCase()
          ) &&
          extractedText.includes("2024")
        ) {
          setPaymentVerified(true);
          
          console.log("Payment verified");
          placeOrder()
        } else {
          console.log("Payment verification failed");
          Alert.alert(
            "Verification Failed",
            "Please Make sure the following things in your Payment Screenshot:\nThe Receiver's Account # should be visible\nThe transaction is made today\nThe transaction must have the amount equal to order total"
          );
          return;
        }
        
      
        
      })
      .catch((error) => {
        console.error("Error during payment verification:", error);
      });
    }
    else
    placeOrder();

   
  };
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (subtotal, item) => subtotal + item.price * item.quantity,
      0
    );
  };

  const calculateOrderTotal = (subtotal, shippingCharges) => {
    return subtotal + shippingCharges;
  };

  const renderCartItemDetails = () => {
    return cartItems.map((item) => (
      <View key={item.productID} style={styles.cartItemContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetailsText}>Qty: {item.quantity}</Text>
        <Text style={styles.productDetailsText}>Unit Price: ${item.price}</Text>
        <Text style={styles.productDetailsText}>
          Total Price: ${item.price * item.quantity}
        </Text>
      </View>
    ));
  };

  const fetchRiderDistances = async () => {
    setLoading(true);

    try {
      const storeResponse = await fetch(
        `http://${IP_ADDRESS}:5000/get-a-store/${storeID}`
      );
      const storeData = await storeResponse.json();
      setStore(storeData.store);

      const ridersString = await AsyncStorage.getItem("riders");
      const riderEmailsArray = ridersString.split(",");

      const [longitude, latitude] = storeData.store.store_address
        .split(",")
        .map(parseFloat);
      const requests = riderEmailsArray.map(async (riderEmail) => {
        console.log(riderEmail);
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/get-distance-of-rider/${riderEmail}/${latitude}/${longitude}`
        );
        const data = await response.json();
        return { email: riderEmail, distance: data.distance, fee: data.fee };
      });

      const results = await Promise.all(requests);

      // Filter out results with errors (e.g., no rider found)
      const validResults = results.filter((result) => !result.error);
      console.log(validResults);
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

        setAssignedRider(minDistanceRider);
      }
    } catch (error) {
      console.log("Error fetching rider distances:", error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    const customerEmailResponse = await fetch(
      `http://${IP_ADDRESS}:5000/get-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactNumber: customerContact }),
      }
    );
    const customerEmailData = await customerEmailResponse.json();
    console.log(customerEmailData.email);
    setCustomerEmail(customerEmailData.email);

    const orderDetails = cartItems.map((item) => {
      return {
        prodId: item.productID,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      };
    });

    const orderData = {
      customerID: customerEmailData.email,
      riderId: assignedRider.email,
      ownerId: store.ownerEmail,
      shippingCharges: assignedRider.fee,
      orderStatus: "in-progress",
      isPrescription: false,
      orderDetails: orderDetails,
      storeId: store.storeID,
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
        // Extract order ID from the response
        const newOrder = await response.json();

        // Clear the cart in Redux store and Cart table
        dispatch(clearCart());

        // Delete item from the cart based on customer_contact
        await fetch(`http://${IP_ADDRESS}:5000/delete/${customerContact}`, {
          method: "DELETE",
        });

        setLoading(false);
        fetch(`http://${IP_ADDRESS}:5000/send-email-order`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ newOrder })
})
.then(response => {
  if (response.ok) {
    // Handle success response
    console.log('Order email sent successfully');
  } else {
    // Handle error response
    console.error('Failed to send order email');
  }
})
.catch(error => {
  // Handle network errors or exceptions
  console.error('Error sending order email:', error);
});


        // Now that the place order request is completed, make the notification request
        const notificationData = {
          orderID: newOrder.orderID,
          riderId: assignedRider.email,
          ownerId: store.ownerEmail,
          customerId: customerEmailData.email,
          dateOfNotiifcation: new Date().toLocaleString(),
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
          if (paymentMethod !== "COD") {
            const name = new Date().getTime() + "_payment";
            const type = "image/jpeg";
            const formData = new FormData();
            formData.append("profile", { name, uri: paymentProofImage, type });
            formData.append("orderID", newOrder.orderID);
            formData.append("mode", paymentMethod);
            fetch(`http://${IP_ADDRESS}:5000/upload-payment`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-type": "multipart/form-data",
              },
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
          }
          navigation.navigate("OrderAnimation", {
            assignedRider,
            storeEndTime: store.endTime,
            customerEmail: customerEmailData.email,
            orderTotal: calculateSubtotal(),
            shippingCharges: assignedRider.fee,
            orderDetails: cartItems.map((item) => ({
              name: item.name,
              prodId: item.productID,
              quantity: item.quantity,
              subtotal: item.price * item.quantity,
            })),
          });
        } else {
          throw new Error("Failed to add notification");
        }
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.log("Error placing order:", error);
      setLoading(false);
    }
  };
  const handleUploadScreenshot = () => {
    console.log("ann");
  };
  useEffect(() => {
    fetchRiderDistances();
  }, []); // Run only on component mount

  // Function to handle payment method change
  const handlePaymentMethodChange = (newValue) => {
    setPaymentMethod(newValue);
    if (newValue === "Jazzcash" || newValue === "Easypaisa") {
      setIsPlaceOrderDisabled(true);
    } else {
      setIsPlaceOrderDisabled(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar/Header */}
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Order Details" />
      </Appbar.Header>

      <Title style={styles.orderDetailsTitle}>Order Details</Title>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#25d366" />
          <Text style={styles.loadingText}>Checking Rider's availability</Text>
        </View>
      )}

      {/* Cart Items */}
      {!loading  && (
        <ScrollView>
            {renderCartItemDetails()}
          {cartItems.length > 0 && (
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                Order Subtotal: ${calculateSubtotal()}
              </Text>
            </View>
          )}

          {/* Shipping Charges */}
          {cartItems.length > 0 && (
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                {loading
                  ? "Shipping charges:  Calculating..."
                  : `Shipping charges:  $${assignedRider.fee}`}
              </Text>
            </View>
          )}

          {/* Order Total */}
          {cartItems.length > 0 && (
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalText}>
                Order Total:
                {!loading
                  ? ` $${calculateOrderTotal(
                      calculateSubtotal(),
                      assignedRider.fee
                    )}`
                  : "  Calculating..."}
              </Text>
            </View>
          )}
      {cartItems.length > 0 &&
      <>
          <Title style={styles.orderDetailsTitle}>Select Payment Method</Title>
          <RadioButton.Group
            onValueChange={handlePaymentMethodChange}
            value={paymentMethod}
          >
            <View style={styles.radioButtonContainer}>
              <RadioButton value="COD" />
              <Text>Cash on Delivery</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton value="Jazzcash" />
              <Text>Jazzcash</Text>
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton value="Easypaisa" />
              <Text>Easypaisa</Text>
            </View>
          </RadioButton.Group>
          
      
          {/* Payment Instructions */}
          {paymentMethod === "Jazzcash" && (
            <Text style={styles.paymentText}>
              Our Jazzcash account No: 03217645512
            </Text>
          )}
          {paymentMethod === "Easypaisa" && (
            <Text style={styles.paymentText}>
              Our Easypaisa account No: 03217645512
            </Text>
          )}
          {paymentMethod !== "COD" && cartItems.length>0 && (
            <TouchableOpacity onPress={handleUploadPicture}>
              <Text style={styles.uploadText}>
                Upload The Payment Screenshot
              </Text>
            </TouchableOpacity>
          )}
          {paymentProofImage && paymentMethod!=="COD" && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: paymentProofImage }} style={styles.image} />
            </View>
            
          )}
      </>
}  
        </ScrollView>
      )}
      {!loading && Object.keys(riderDistances).length === 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>No Rider's available</Text>
        </View>
      )}
      {/* Place Order Button */}
      {!loading &&
        cartItems.length > 0 &&
        (
            // Render Place Order Button
            <Button
              mode="contained"
              style={[
                styles.checkoutButton,
                {
                  backgroundColor: `${
              "#25d366"
                  }`,
                },
              ]}
              onPress={handleVerifyPayment}
            >
              {isPaymentUploaded
                ? "Verify Payment and Place Order"
                : "Place Order"}
            </Button>
          )}
    </View>
  );
};
export default PlaceOrderScreen;
