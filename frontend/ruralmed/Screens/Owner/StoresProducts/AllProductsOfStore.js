import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Appbar, Title, Button, Switch, FAB } from "react-native-paper";
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 icon from react-native-vector-icons
import IP_ADDRESS from "../../../config/config";
import styles from "./styles/styles";

const AllProductsOfScreen = ({ route, navigation }) => {
  const { store } = route.params;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/products/${store.storeID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    setEditedProduct(product);
    setUpdatedProduct(product);
    setEditModalVisible(true);
  };
  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(`http://${IP_ADDRESS}:5000/update-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedProduct.name,
          description: updatedProduct.description,
          availableQuantity: updatedProduct.availableQuantity,
          productID: updatedProduct.productID,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
  
      // If the update is successful, show a success message
      Alert.alert('Update', 'Product updated successfully');
      setProducts(prevProducts => prevProducts.map(product =>
        product.productID === updatedProduct.productID ? updatedProduct : product
      ));
      // Hide the edit modal
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    }
  };
  

  const handleDeleteProduct = async (productID) => {
    try {
      const response = await fetch(`http://${IP_ADDRESS}:5000/delete-product/${productID}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      // If the deletion is successful, show a success message
      Alert.alert('Success', 'Product deleted successfully');
  
      // Remove the deleted product from the UI
      setProducts((prevProducts) => prevProducts.filter((product) => product.productID !== productID));
    } catch (error) {
      console.error('Error deleting product:', error);
      Alert.alert('Error', 'Failed to delete product');
    }
  };
   
  const handleToggleProduct = async (productID, value) => {
    try {
      const response = await fetch(`http://${IP_ADDRESS}:5000/update-product-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productID: productID,
          hasEnabled: value,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product status');
      }
  
      // Update the product's status in the UI
      setProducts(prevProducts => prevProducts.map(product =>
        product.productID === productID ? { ...product, has_enabled: value } : product
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
      Alert.alert('Error', 'Failed to update product status');
    }
  };
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="#25d366"
        barStyle="light-content"
        translucent={true}
        height={20}
      />
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={store.storeName} />
      </Appbar.Header>
      <Image
        source={{
          uri:
            store.storeType === "Agriculture"
              ? "https://i.ibb.co/VSbD0cf/pexels-flambo-1112080-1.jpg"
              : store.storeType === "Pharmacy"
              ? "https://i.ibb.co/59nTNhP/laurynas-me-1-TL8-Ao-EDj-c-unsplash.jpg"
              : "https://i.ibb.co/J5bFMhq/istockphoto-1167064450-612x612.jpg",
        }}
        style={styles.image}
      />
      <ScrollView>
        <Title style={{ color: "#25d366", fontSize: 28, fontWeight: "bold", marginLeft:100, marginTop:20 }}>
          Listed Products
        </Title>
      
        {products.length > 0 ? (
          products.map((product) => (
            <View key={product.productID} style={styles.productContainer}>
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>
                    {product.description}
                  </Text>
                  <Text style={styles.productPrice}>${product.price}</Text>
                </View>        
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
  <TouchableOpacity
    onPress={() => handleEditProduct(product)}
    style={styles.iconButton}
  >
    <FontAwesome5 name="edit" size={24} color="#25d366" />
  </TouchableOpacity>
  <Switch
  value={product.has_enabled}
  onValueChange={(value) => handleToggleProduct(product.productID, value)}
  color="#25d366" // Set the color of the switch when it's turned on
  style={{ marginLeft: 80, marginRight: 10 }}
/>
  <TouchableOpacity
    onPress={() => handleDeleteProduct(product.productID)}
    style={styles.iconButton}
  >
    <FontAwesome5 name="trash-alt" size={24} color="red" />
  </TouchableOpacity>
</View>

            </View>
          ))
        ) : (
          <>
            <Text style={styles.noProducts}>No products available</Text>
            <TouchableOpacity onPress={() => navigation.replace('OwnerAddProductScreen')}>
              <Text style={styles.getStartedText}>Add one to get Started</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Modal for editing product */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Content of the modal */}
            <Title style={{ color: "#25d366", fontSize: 20, fontWeight: "bold", marginLeft:80, marginTop:10 }}>
          Edit Details
        </Title>
      
        <Text style={{color:'#25d366', fontSize:19, marginLeft:10}}>Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Product Name"
              value={updatedProduct.name}
              onChangeText={(text) => setUpdatedProduct({...updatedProduct, name: text})}
            />
        <Text style={{color:'#25d366', fontSize:19, marginLeft:10}}>Description</Text>
        
            <TextInput
              style={styles.modalInput}
              placeholder="Description"
              value={updatedProduct.description}
              onChangeText={(text) => setUpdatedProduct({...updatedProduct, description: text})}
            />
        <Text style={{color:'#25d366', fontSize:19, marginLeft:10}}>Quantity left </Text>
        
            <TextInput
              style={styles.modalInput}
              placeholder="Price"
              value={String(updatedProduct.price)}
              onChangeText={(text) => setUpdatedProduct({...updatedProduct, price: parseFloat(text)})}
            />
            {/* Buttons */}
            <Button onPress={handleUpdateProduct}>Update</Button>
            <Button onPress={() => setEditModalVisible(false)}>Cancel</Button>
          </View>
        </View>
      </Modal>
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => navigation.navigate("OwnerAddProductScreen")}
      />

    </View>
  );
};

export default AllProductsOfScreen;
