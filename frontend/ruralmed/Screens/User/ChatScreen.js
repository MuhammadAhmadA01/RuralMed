import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import useFetchEmail from "../../utils/useFetchEmail";
import IP_ADDRESS from "../../config/config";
import { Appbar } from "react-native-paper";

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderID, setOrderID] = useState(null);
  const [meetingId, setMeetingID] = useState(null);
  const [checkFlag, setCheckFlag] = useState(0);
  const [subMenuLevel, setSubMenuLevel] = useState(-1); // Track sub-menu level
  const email = useFetchEmail();
  console.log(email);
  useEffect(() => {
    // Initial message from the system
    const systemMessage = {
      _id: 1,
      text: "  Welcome to ruralMed Support  \n\nHow may I help you? Please select an issue:\n1: Order\n2: Rider\n3: Meeting\n4: Other\n0: Exit",
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
      case 3: // Meeting
        setSelectedOption("Meeting");
        showMeetingSubMenu();
        break;
      case 4: // Other
        setSelectedOption("Other");
        sendSystemMessage(
          "Please write us the detail of the issue in an email on ruralmed123@gmail.com or contact us at +923017088962\n\n0: Main menu"
        );
        break;
      case 0:
        navigation.navigate("HomeCustomer");
      default:
        sendSystemMessage(
          "Please choose a valid option from the menu:\n1: Order\n2: Rider\n3: Meeting\n4: Other\n0: Exit"
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
      case "Meeting":
        handleMeetingSubMenuResponse(selectedSubOption);
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
          "Please write us the detail of the issue in an email on ruralmed123@gmail.com or contact us at +923017088962\n\n0: Main menu"
        );
        break;
      case "2":
        if (!orderID) {
          sendSystemMessage(
            "Please enter the order number:\n\n0: For Main Menu"
          );
          setCheckFlag(1);
          setSubMenuLevel(0);
        } else {
          fetchOrderDetails(orderID);
        }
        break;
      default:
        sendSystemMessage(
          "Please choose a valid option from the sub-menu:\n1: Wrong products\n2: Not delivered yet\n3: Damaged/Open products\n0: For Main Menu"
        );
        break;
    }
  };

  const handleRiderSubMenuResponse = () => {
    setSelectedOption(null);
    showMainMenu();
  };
  const handleMeetingSubMenuResponse = (selectedSubOption) => {
    switch (selectedSubOption) {
      case "0": // Go back to main menu
        setSelectedOption(null);
        showMainMenu();
        break;
      case "1":
        console.log("aimmi");
        if (!meetingId) {
          sendSystemMessage("Please enter Meeting number (numeric):");
          setSubMenuLevel(2);
          setCheckFlag(1);
        } else fetchMeetingDetails(meetingId);
        break;
      case "2":
        if (!meetingId) {
          sendSystemMessage(
            "Please enter Meeting number (numeric) to check its status:"
          );
          setCheckFlag(2);
          setSubMenuLevel(3); // Set sub-menu level to prompt for meeting ID for status check
        } else {
          fetchMeetingDetails(meetingId);
        }
        break;
      case "3":
        sendSystemMessage(
          "Please write us an email at ruralmed123@gmail.com Or contact us through +923017088962. Also, You can directly Write a review for the meeting with the issue details\n\n0: For Main Menu"
        );
        break;
      default:
        sendSystemMessage(
          "Please choose a valid option from the sub-menu:\n1: Meeting Schedule\n2: Meeting Status\n3: Other\n0: For Main Menu"
        );
        break;
    }
  };

  const convertTo12HourClock = (time) => {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let formattedHours = parseInt(hours);
    if (formattedHours >= 12) {
      period = "PM";
      formattedHours -= 12;
    }
    if (formattedHours === 0) {
      formattedHours = 12;
    }
    return `${formattedHours}:${minutes} ${period}`;
  };
  const fetchMeetingDetails = async (meetingID) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:5000/get-meeting-by-id/${meetingID}`
      );
      console.log(response);
      if (response.ok) {
        const meetingData = await response.json();
        console.log(meetingData);
        if (meetingData.meeting.customerId !== email) {
          sendSystemMessage(
            "This meeting does not belong to you.\nEnter meeting ID again"
          );
        } else {
          // Display meeting details based on the fetched data
          const { status, scheduledDate, startTime, endTime } =
            meetingData.meeting;
          const formattedStartTime = convertTo12HourClock(startTime);
          const formattedEndTime = convertTo12HourClock(endTime);
          const message =
            subMenuLevel !== 2
              ? `Your meeting is: ${status}\n0: For Main Menu`
              : `Meeting Schedule Date: ${scheduledDate}\nStart Time: ${formattedStartTime}\nEnd Time: ${formattedEndTime}\n0: For Main Menu`;
          sendSystemMessage(message);
        }
      } else {
        sendSystemMessage(
          "Failed to fetch meeting details.\nPlease try with correct meeting ID."
        );
        setCheckFlag(1);
      }
    } catch (error) {
      console.log("Error fetching meeting details:", error);
      sendSystemMessage(
        "Error fetching meeting details. Please try again later."
      );
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
          deliveryDate.setDate(deliveryDate.getDate() + 1);
          const formattedDeliveryDate = deliveryDate.toLocaleString();
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
      "  Welcome to ruralMed Support  \n\nHow may I help you? Please select an issue:\n1: Order\n2: Rider\n3: Meeting\n4: Other\n0: Exit"
    );
  };

  const showOrderSubMenu = () => {
    sendSystemMessage(
      "Please select an order-related issue:\n1: Wrong products\n2: Not delivered yet\n3: Damaged/Open products\n0: Back to main menu"
    );
    setOrderID(null);
  };

  const showMeetingSubMenu = () => {
    sendSystemMessage(
      "Please select a Meeting-related issue:\n1: Meeting Schedule\n2: Meeting Status\n3: Other\n0: Back to main menu"
    );
    setMeetingID(null);
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
    console.log(subMenuLevel);
    if (
      userMessage[0] >= "0" &&
      userMessage[0] <= "9" &&
      userMessage.length == 1 &&
      checkFlag === 0
    ) {
      if (selectedOption) {
        {
          handleSubMenuResponse(userMessage);
        }
      } else {
        handleMainMenuResponse(parseInt(userMessage));
      }
    } else {
      if (subMenuLevel === 0) {
        sendUserMessage(`Order # is  ${userMessage}`);
        fetchOrderDetails(userMessage);
        setOrderID(userMessage);
        setCheckFlag(0);
      } else {
        if (subMenuLevel === 2) {
          sendUserMessage(`Meeting # is ${userMessage}`);
          fetchMeetingDetails(userMessage);
          setMeetingID(meetingId);
          setCheckFlag(0);
        } else if (subMenuLevel === 3) {
          sendUserMessage(`Meeting # is ${userMessage}`);
          fetchMeetingDetails(userMessage);
          setMeetingID(meetingId);
          setCheckFlag(0);
        } else {
          sendUserMessage(userMessage);
          sendSystemMessage(`Please select a valid choice`);setSelectedOption(null);
        }
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
        return "Meeting";
      case 4:
        return "Other";
      default:
        return "";
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Support" />
      </Appbar.Header>
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
    </View>
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
