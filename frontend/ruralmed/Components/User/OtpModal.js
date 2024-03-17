import React, { useState,useEffect } from "react";
import { Modal, Text, View, TextInput, TouchableOpacity } from "react-native";

const OTPModal = ({ visible, onSubmit, onClose,generatedOtp }) => {
  const [otp, setOtp] = useState("");

  const [timeLeft, setTimeLeft] = useState(60); // 300 seconds = 5 minutes

  // Function to format time left in mm:ss format
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Effect to update the timer every second
  useEffect(() => {
    if (timeLeft === 0) {
      onClose(); // Close the modal when time expires
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, onClose]);

  const handleVerify = () => {
    onSubmit(otp,generatedOtp);
    setOtp(""); // Clear OTP input after submission
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            width:"80%",maxWidth:400
          }}
        >
          <Text style={{ marginBottom: 10 }}>Enter OTP:</Text>
          <TextInput
            style={{
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 5,
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 80,
              paddingLeft: 80,



              marginBottom: 10,
            }}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#25d366",
              padding: 10,
              borderRadius: 5,
              width: "100%",
              alignItems: "center",
            }}
            onPress={handleVerify}
          >
            <Text style={{ color: "white" }}>Verify OTP</Text>
          </TouchableOpacity>
          <Text style={{ marginTop: 10 }}>OTP expires in: {formatTimeLeft()}</Text>
         
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={onClose}
          >
            <Text style={{ color: "#25d366" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;
