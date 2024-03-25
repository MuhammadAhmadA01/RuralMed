import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Paragraph, FAB } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import IP_ADDRESS from "../../config/config";
import AppHeader from "../../Components/Owner/OwnerAppHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllStoresScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      const contactNumber = await AsyncStorage.getItem("phone");
      try {
        setLoading(true); // Set loading to true when starting the fetch

        const response = await fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contactNumber }),
        });
        const data = await response.json();
        setEmail(data.email);

        const storesResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-all-stores/${data.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await storesResponse.json();

        if (result.success) {
          const storeList = Array.isArray(result)
            ? result
            : Object.values(result);
          setStores(storeList[0]);
        }

        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching stores:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchOwnerProfile();
  }, []);

  const handleCardPress = (store) => {
    // Navigate to OwnerStoreScreen with store details
    navigation.navigate("AllProductsOfStoreScreen", { store });
  };

  const renderStores = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#25d366"
            style={{ marginTop: "60%" }}
          />
          <Text>Loading Stores...</Text>
        </View>
      );
    }

    if (stores.length === 0) {
      return (
        <View style={styles.noStoresContainer}>
          <Text style={styles.noStoresText}>No stores added.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("OwnerStoreScreen")}
            style={styles.getStartedLink}
          >
            <Text style={styles.getStartedText}>Add one to get started</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return stores.map((store) => (
      <TouchableOpacity
        key={store.storeID}
        onPress={() => handleCardPress(store)}
      >
        <Card style={styles.card}>
          <Card.Cover
            source={{ uri:
        
              store.storeType === "Agriculture"
                ? "https://i.ibb.co/VSbD0cf/pexels-flambo-1112080-1.jpg"
                : store.storeType === "Pharmacy"
                ? "https://i.ibb.co/59nTNhP/laurynas-me-1-TL8-Ao-EDj-c-unsplash.jpg"
                : "https://i.ibb.co/J5bFMhq/istockphoto-1167064450-612x612.jpg",
         
            }}
            style={styles.cardImage}
          />
          <Card.Content>
            <Title style={styles.cardTitle}>{store.storeName}</Title>
            <Paragraph style={styles.cardType}>{store.storeType}</Paragraph>
            <View style={styles.contactContainer}>
              <Ionicons
                name="call"
                size={20}
                color="#25d366"
                style={styles.icon}
              />
              <Paragraph style={styles.contactText}>
                {store.storeContact}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader navigation={navigation}></AppHeader>
      <View style={{ padding: 16, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          Your Listed Stores
        </Title>
      </View>

      <ScrollView>{renderStores()}</ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="white"
        onPress={() => navigation.navigate("OwnerStoreScreen")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardImage: {
    height: 150,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardType: {
    fontSize: 14,
    color: "#25d366",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
  },
  noStoresContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "70%",
    paddingLeft: "7%",
  },
  noStoresText: {
    fontSize: 18,
    marginBottom: 16,
  },
  getStartedLink: {
    color: "#25d366",
  },
  getStartedText: {
    color: "#25d366",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius:50,
    backgroundColor: "#25d366",
  },
});

export default AllStoresScreen;
