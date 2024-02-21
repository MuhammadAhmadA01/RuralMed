import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";

const LoadingScreen = ({ route, navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("OrderConfirmationScreen", route.params);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/delivery.gif")}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
});

export default LoadingScreen;
