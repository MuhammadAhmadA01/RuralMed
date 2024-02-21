import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../../../Components/Cart/CartSlice';
import IP_ADDRESS from '../../../../config/config';
const CartItem = ({ item, localQuantities, phoneNum }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  
  const handleRemoveItem = async (productID) => {
    const apiEndpoint2 = `http://${IP_ADDRESS}:5000/remove-from-cart/${productID}/${phoneNum}`;

    try {
      // Make API call
      const response = await fetch(apiEndpoint2);
      if (response.ok) {
        // If the API call is successful, dispatch the action to update the Redux store
        dispatch(removeFromCart(productID));
      } else {
        console.error("Remove from cart API call failed", response);
      }
    } catch (error) {
      console.error(
        "Remove from cart API call failed with an exception:",
        error
      );
    }
  };

  const handleQuantityChange = async (product, change) => {
    console.log(change)
    const item = cartItems.find((item) => item.productID === product.productID);
    if (item) {
      if (change > 0) {
        const res = await fetch(`http://${IP_ADDRESS}:5000/add-to-cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerContact: phoneNum,
            product,
          }),
        });
        if (res.status === 404) {
          Alert.alert(
            "Limti exceeds",
            "Your quantity exceeds the available quantity"
          );
          return;
        } else
          dispatch(
            updateCartItemQuantity({ productID: product.productID, change })
          );
      } else {
        try {
          // Make a fetch call to update the quantity
          const updateQuantityEndpoint = `http://${IP_ADDRESS}:5000/update-qty/${phoneNum}/${product.productID}`;

          const updateResponse = await fetch(updateQuantityEndpoint);
          const minusRes = await updateResponse.json();
          dispatch(
            updateCartItemQuantity({ productID: product.productID, change })
          );
        } catch (error) {
          console.error("Quantity update failed with an exception:", error);
        }
      }
    }
  };

  return (
    <View style={styles.cartItemContainer} >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <View style={styles.quantityContainer} key={item.productID}>
        <TouchableOpacity
          onPress={() => item.quantity > 1 && handleQuantityChange(item, -1)}
          style={item.quantity === 1 ? styles.disabledButton : null}
          disabled={item.quantity === 1}
        >
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>
          {localQuantities[item.productID]}
        </Text>
        <TouchableOpacity onPress={() => handleQuantityChange(item, 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.productID)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 5,
    color: 'black',
  },
  removeButton: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default CartItem;
