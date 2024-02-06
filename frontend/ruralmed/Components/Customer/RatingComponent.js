import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import { StyleSheet } from "react-native";

const RatingComponent = ({ label, rating, onRatingChange, onClearRating }) => {
  return (
    <View style={styles.ratingSection}>
      <View style={styles.ratingRow}>
        <Text style={styles.ratingLabel}>{label}</Text>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
          defaultRating={rating}
          size={30}
          onFinishRating={(rating) => onRatingChange(rating)}
        />
        <TouchableOpacity onPress={onClearRating}>
          <Text style={styles.clearButton}>Clear Rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 20,
    color: "#25d366", // Primary color
  },
  clearButton: {
    color: "#25d366", // Primary color
    textDecorationLine: "underline",
  },
});

export default RatingComponent;
