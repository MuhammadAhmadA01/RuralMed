import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Title, Paragraph, TextInput, Button } from "react-native-paper";
import { Alert } from "react-native";
import OrderCompletedComponent from "../../Components/Customer/OrderCompletedComponent";
import RatingComponent from "../../Components/Customer/RatingComponent";
import IP_ADDRESS from "../../config/config";
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
    // Construct the request body
    const requestBody = {
      order_id: order.orderID, // Assuming order has an 'id' property
      rating_for_rider: riderRating,
      rating_for_Owner: ownerRating,
      review: reviewText,
    };
  
    // Make the POST request
    fetch(`http://${IP_ADDRESS}:5000/addRating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data (if needed)
        
        Alert.alert("Thank you for your feedback", "We appreciate your effort to provide us with your worthy insights");
      })
      .catch((error) => {
        // Handle errors
        console.error('Error submitting rating', error);
        // You might want to display an error message to the user
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
const styles = StyleSheet.create({
  reviewSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  reviewTitle: {
    fontSize: 18,
    color: "#25d366", // Primary color
    marginBottom: 10,
  },
  reviewDescription: {
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: "#25d366", // Primary color
  },
});
