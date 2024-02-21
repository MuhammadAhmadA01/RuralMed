import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Title, Paragraph, TextInput, Button } from "react-native-paper";
import { Alert } from "react-native";
import OrderCompletedComponent from "./Components/OrderCompletedComponent";
import RatingComponent from "./Components/RatingComponent";
import IP_ADDRESS from "../../../config/config";
import styles from "./styles/styles";
const RateAndReviewScreen = ({ navigation, route }) => {
  const {order}=route.params
  const [riderRating, setRiderRating] = useState(0);
  const [ownerRating, setOwnerRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const clearRiderRating = () => {
    setRiderRating(0);
  };

  const clearOwnerRating = () => {
    setOwnerRating(0);
  };

  const submitRating = () => {
    const requestBody = {
      order_id: order.orderID, 
      rating_for_rider: riderRating,
      rating_for_Owner: ownerRating,
      review: reviewText,
    };
  
    fetch(`http://${IP_ADDRESS}:5000/addRating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        
        Alert.alert("Thank you for your feedback", "We appreciate your effort to provide us with your worthy insights");
        navigation.replace('HomeCustomer');
      })
      .catch((error) => {
        console.error('Error submitting rating', error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{backgroundColor:'#25d366'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Rate the Order"  />
      </Appbar.Header>

      <OrderCompletedComponent />

      <RatingComponent
        label="Rate Rider"
        rating={riderRating}
        onRatingChange={setRiderRating}
        onClearRating={clearRiderRating}
      />

      <RatingComponent
        label="Rate Owner"
        rating={ownerRating}
        onRatingChange={setOwnerRating}
        onClearRating={clearOwnerRating}
      />
 {/* Review Input Section */}
 <View style={styles.reviewSection}>
        <Title style={styles.reviewTitle}>Share your feedback here</Title>
        <Paragraph style={styles.reviewDescription}>
          Your review helps us improve our service!
        </Paragraph>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={reviewText}
          onChangeText={(text) => setReviewText(text)}
        />
        <Button
          mode="contained"
          onPress={submitRating}
          style={styles.submitButton}
        >
          Submit Rating
        </Button>
      </View>
    </View>
  );
};

export default RateAndReviewScreen;
