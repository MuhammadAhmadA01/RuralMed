import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchEmail from "../../utils/useFetchEmail";
import IP_ADDRESS from "../../config/config";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const [subMenuLevel, setSubMenuLevel] = useState(0); // Track sub-menu level
  const email = useFetchEmail();
  console.log(email);
  useEffect(() => {
    // Initial message from the system
    const systemMessage = {
      _id: 1,
      text: "  Welcome to ruralMed Support  \n\nHow may I help you? Please select an issue:\n1: Order\n2: Rider\n3: DVM\n4: Other\n0: Exit",
      createdAt: new Date(),
      user: { _id: 2, name: "System" },
    };
    setMessages([systemMessage]);
  }, []);

  const handleMainMenuResponse = (selectedOptionIndex) => {
    const userMessage = getMessageFromOption(selectedOptionIndex);
    sendUserMessage(userMessage);
    switch (selectedOptionIndex) {
      case 1: // Order
        setSelectedOption("Order");
        showOrderSubMenu();
        break;
      case 2: // Rider
        setSelectedOption("Rider");
        sendSystemMessage(
          "We are sorry for the inconvenience. We will really appreciate if you provide us more details in the feedback section. For feedback, please navigate to My Orders -> Completed -> Write a review.\n0: Back to main menu"
        );
        break;
      case 3: // DVM
        setSelectedOption("DVM");
        showDvmSubMenu();
        break;
      case 4: // Other
        setSelectedOption("Other");
        sendSystemMessage(
          "Please write us the detail of the issue in an email on mahmad.8962@gmail.com or drop a WhatsApp message at +923017088962\n\n0: Main menu"
        );
        break;
      case 0:
        navigation.navigate("HomeCustomer");
      default:
        sendSystemMessage(
          "Please choose a valid option from the menu:\n1: Order\n2: Rider\n3: DVM\n4: Other\n0: Exit"
        );
        break;
    }
  };

  const handleSubMenuResponse = (selectedSubOption) => {
    const userMessage = `Selected: ${selectedSubOption}`;
    sendUserMessage(userMessage);
    switch (selectedOption) {
      case "Order":
        handleOrderSubMenuResponse(selectedSubOption);
        break;
      case "DVM":
        handleDvmSubMenuResponse(selectedSubOption);
        break;
      case "Rider":
        handleRiderSubMenuResponse();
        break;

      default:
        showMainMenu();
        break;
    }
  };

  const handleOrderSubMenuResponse = (selectedSubOption) => {
    switch (selectedSubOption) {
      case "0": // Go back to main menu
        setSelectedOption(null);
        showMainMenu();
        break;
      case "1":
      case "3":
        sendSystemMessage(
          "Please write us an email and must attach pictures of the received parcel."
        );
        break;
      case "2":
        if (!orderID) {
          sendSystemMessage("Please enter the order number:");
          setSubMenuLevel(2);
        } else {
          fetchOrderDetails(orderID);
        }
        break;
      default:
        sendSystemMessage(
          "Please choose a valid option from the sub-menu:\n1: Wrong products\n2: Not delivered yet\n3: Damaged/Open products"
        );
        break;
    }
  };

  const handleRiderSubMenuResponse = () => {
    setSelectedOption(null);
    showMainMenu();
  };
  const handleDvmSubMenuResponse = (selectedSubOption) => {
    switch (selectedSubOption) {
      case "0": // Go back to main menu
        setSelectedOption(null);
        showMainMenu();
        break;
      case "1":
        sendSystemMessage("DVM availability");
        break;
      case "2":
        sendSystemMessage("Prescription Issue");
        break;
      case "3":
        sendSystemMessage("Other");
        break;
      default:
        sendSystemMessage(
          "Please choose a valid option from the sub-menu:\n1: DVM availability\n2: Prescription Issue\n3: Other"
        );
        break;
    }
  };

  const fetchOrderDetails = async (orderID) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:5000/order/${orderID}`
      );
      console.log(response);
      if (response.ok) {
        const orderData = await response.json();
        console.log(orderData);
        if (orderData.order.customerID === email) {
          const deliveryDate = new Date(orderData.order.dateOfOrder);
          deliveryDate.setDate(deliveryDate.getDate() + 1); // Adding one day to deliveryDate
          const formattedDeliveryDate = deliveryDate.toLocaleString(); // Format delivery date as needed
          sendSystemMessage(
            `Estimated delivery time for order is ${formattedDeliveryDate}\n\n0:For main menu`
          );
        } else {
          sendSystemMessage(
            "This order does not belong to you.\nEnter order # again"
          );
        }
      } else {
        sendSystemMessage(
          "Failed to fetch order details.\nPlease try with correct order #."
        );
      }
    } catch (error) {
      console.log("Error fetching order details:", error);
      sendSystemMessage(
        "Error fetching order details. Please try again later."
      );
    }
  };

  const showMainMenu = () => {
    sendSystemMessage(
      "  Welcome to ruralMed Support  \n\nHow may I help you? Please select an issue:\n1: Order\n2: Rider\n3: DVM\n4: Other\n0: Exit"
    );
  };

  const showOrderSubMenu = () => {
    sendSystemMessage(
      "Please select an order-related issue:\n1: Wrong products\n2: Not delivered yet\n3: Damaged/Open products\n0: Back to main menu"
    );
  };

  const showDvmSubMenu = () => {
    sendSystemMessage(
      "Please select a DVM-related issue:\n1: DVM availability\n2: Prescription Issue\n3: Other\n0: Back to main menu"
    );
  };

  const sendSystemMessage = (text) => {
    const systemMessage = {
      _id: Math.random(),
      text: text,
      createdAt: new Date(),
      user: { _id: 2, name: "System" },
    };
    setMessages((prevMessages) => [systemMessage, ...prevMessages]);
  };

  const sendUserMessage = (text) => {
    const userMessage = {
      _id: Math.random(),
      text: text,
      createdAt: new Date(),
      user: { _id: 1, name: "User" },
    };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
  };

  const renderSystemMessage = (props) => {
    const { currentMessage } = props;
    return (
      <TouchableOpacity
        onPress={() => {
          const option = currentMessage.text.split(":")[0];
          if (selectedOption) {
            handleSubMenuResponse(option);
          } else {
            handleMainMenuResponse(option);
          }
        }}
      >
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{currentMessage.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onSend = (newMessages) => {
    // Handle user's response when they send a message
    const userMessage = newMessages[0].text;
    console.log(userMessage);
    if (
      userMessage[0] >= "0" &&
      userMessage[0] <= "9" &&
      userMessage.length == 1
    ) {
      if (selectedOption) {
        handleSubMenuResponse(userMessage);
      } else {
        handleMainMenuResponse(parseInt(userMessage));
      }
    } else {
      if (subMenuLevel) {
        sendUserMessage(`Order # is  ${userMessage}`);
        fetchOrderDetails(userMessage);
        setOrderID(userMessage);
      } else {
        sendUserMessage(userMessage);
        sendSystemMessage("Please select Valid choice");
      }
    }
  };

  const getMessageFromOption = (optionIndex) => {
    switch (optionIndex) {
      case 1:
        return "Order";
      case 2:
        return "Rider";
      case 3:
        return "DVM";
      case 4:
        return "Other";
      default:
        return "";
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{ _id: 1 }}
      alwaysShowSend={false}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "#25d366", // User's message color
            },
            left: {
              backgroundColor: "#e0e0e0", // System's message color
            },
          }}
          textStyle={{
            right: {
              color: "white", // User's message text color
            },
            left: {
              color: "black", // System's message text color
            },
          }}
        />
      )}
      renderSystemMessage={renderSystemMessage}
    />
  );
};

const styles = StyleSheet.create({
  systemMessageContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  systemMessageText: {
    fontSize: 16,
  },
});

export default ChatScreen;
