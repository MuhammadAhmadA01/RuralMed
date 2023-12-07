// PlaceOrderScreen.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Button, Title } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../../config/config';
import { clearCart } from '../../Components/Cart/CartSlice';

const PlaceOrderScreen = ({ navigation,route }) => {
  const {customerContact}=route.params
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const storeID = useSelector((state) => state.cart.storeInfo);
  const [loading, setLoading] = useState(false);
  const [riderDistances, setRiderDistances] = useState({});
  const [assignedRider, setAssignedRider] = useState({});
  const [store, setStore] = useState({});
  const [customerEmail, setCustomerEmail] = useState('');

  const calculateSubtotal = () => {
    return cartItems.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
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
        <Text style={styles.productDetailsText}>Total Price: ${item.price * item.quantity}</Text>
      </View>
    ));
  };

  const fetchRiderDistances = async () => {
    setLoading(true);

    try {
      const storeResponse = await fetch(`http://${IP_ADDRESS}:5000/get-a-store/${storeID}`);
      const storeData = await storeResponse.json();
      setStore(storeData.store);

      const ridersString = await AsyncStorage.getItem('riders');
      const riderEmailsArray = ridersString.split(',');

      const [longitude, latitude] = storeData.store.store_address.split(',').map(parseFloat);
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

        console.log('Minimum Distance Rider:', minDistanceRider);
        setAssignedRider(minDistanceRider);
      }
    } catch (error) {
      console.error('Error fetching rider distances:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    console.log(customerContact)
    const customerEmailResponse = await fetch(`http://${IP_ADDRESS}:5000/get-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contactNumber: customerContact }),
    });
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
      orderStatus: 'in-progress',
      isPrescription: false,
      orderDetails: orderDetails,
    };

    try {
      const response = await fetch(`http://${IP_ADDRESS}:5000/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Clear the cart in Redux store and Cart table
        dispatch(clearCart());

        // Delete item from the cart based on customer_contact
        await fetch(`http://${IP_ADDRESS}:5000/delete/${customerContact}`, {
          method: 'DELETE',
        });

        setLoading(false);
        navigation.navigate('OrderAnimation', {
          assignedRider,
          storeEndTime: store.endTime,
          customerEmail: customerEmailData.email,
          orderTotal: calculateSubtotal(),
          shippingCharges: assignedRider.fee,
          orderDetails: cartItems.map((item) => ({
            name:item.name,
            prodId: item.productID,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        });
     
     
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRiderDistances();
  }, []); // Run only on component mount

  return (
    <View style={{ flex: 1 }}>
      {/* Appbar/Header */}
      <Appbar.Header>
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
      {!loading && (
        <ScrollView>
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>Empty cart</Text>
              <TouchableOpacity onPress={() => navigation.navigate('HomeCustomer')}>
                <Text style={styles.browseStoresText}>Browse to Stores</Text>
              </TouchableOpacity>
            </View>
          ) : (
            renderCartItemDetails()
          )}
        </ScrollView>
      )}

      {/* Order Subtotal */}
      {cartItems.length > 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Order Subtotal: ${calculateSubtotal()}</Text>
        </View>
      )}

      {/* Shipping Charges */}
      {cartItems.length > 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            {loading ? 'Shipping charges:  Calculating...' : `Shipping charges:  $${assignedRider.fee}`}
          </Text>
        </View>
      )}

      {/* Order Total */}
      {cartItems.length > 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>
            Order Total:
            {!loading
              ? ` $${calculateOrderTotal(calculateSubtotal(), assignedRider.fee)}`
              : '  Calculating...'}
          </Text>
        </View>
      )}

      {/* Display Rider Distances */}

      {/* No Rider Available */}
      {!loading && Object.keys(riderDistances).length === 0 && (
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>No Rider's available</Text>
        </View>
      )}

      {/* Place Order Button */}
      {!loading && cartItems.length > 0 && (
        <Button mode="contained" style={styles.checkoutButton} onPress={placeOrder}>
          Place Order
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Style definitions for the CheckoutScreen
  orderDetailsTitle: {
    marginLeft: '3%',
    color: '#25d366',
    fontWeight: '700',
    marginTop: '2%',
  },
  cartItemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetailsText: {
    fontSize: 14,
    color: 'gray',
  },
  subtotalContainer: {
    margin: 10,
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    margin: 16,
    backgroundColor: '#25d366',
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '60%',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  browseStoresText: {
    fontSize: 16,
    color: '#25d366',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default PlaceOrderScreen;
