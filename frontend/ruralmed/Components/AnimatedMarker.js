import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Marker } from "react-native-maps";

const AnimatedMarker = ({ coordinate, title, duration }) => {
  const markerRef = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(markerRef.current, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const translateY = markerRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust this value to control the animation distance
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Marker coordinate={coordinate} title={title} />
    </Animated.View>
  );
};

export default AnimatedMarker;
