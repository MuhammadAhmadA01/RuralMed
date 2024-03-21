import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { Card, Title, Chip, Button } from "react-native-paper";
import moment from "moment";
import useFetchEmail from "../../../utils/useFetchEmail";
import IP_ADDRESS from "../../../config/config";
import styles from "./styles/styles";
import AppHeaderDvm from "../../../Components/DVM/DvmHeader";
const DvmAllMeetings = ({ navigation }) => {
  const [meetings, setMeetings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const email = useFetchEmail();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = email;
        const meetingsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-all-meetings-of-dvm/${id}`
        );

        if (!meetingsResponse.ok) {
          throw new Error("Error fetching meetings");
        }

        const meetingsData = await meetingsResponse.json();

        setMeetings(meetingsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status.toLowerCase());
  };

  const handleCardPress = (meetingID) => {
    console.log("Clicked on meeting:", meetingID);
  };

  const handleMarkAsCompleted = async (meetingID) => {
    try {
      const response = await fetch(
        `http://${IP_ADDRESS}:5000/update-meeting-status/${meetingID}/completed`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Error updating meeting status");
      }

      // Find the index of the meeting with the given ID
      const index = meetings.findIndex(
        (meeting) => meeting.Meeting.meetingID === meetingID
      );

      // Create a copy of the meetings array to update the meeting status
      const updatedMeetings = [...meetings];
      updatedMeetings[index].Meeting.status = "completed";

      // Update the meetings state with the updated array
      setMeetings(updatedMeetings);
    } catch (error) {
      console.error("Error updating meeting status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#25d366"; // Green color for completed
      case "scheduled":
        return "red"; // Red color for in-progress
      case "in-progress":
        return "green"; // Black color for picked
      default:
        return "black"; // Default to black for other statuses
    }
  };

  const filterMeetingsByStatus = () => {
    if (selectedStatus === "all") {
      return meetings;
    } else {
      return meetings.filter(
        (meeting) =>
          meeting.Meeting.status.toLowerCase() ===
          selectedStatus.toLocaleLowerCase()
      );
    }
  };

  const renderMeetingCards = () => {
    const filteredMeetings = filterMeetingsByStatus();

    return filteredMeetings.map((meeting) => (
      <TouchableOpacity
        key={meeting.Meeting.meetingID}
        onPress={() => handleCardPress(meeting.Meeting.meetingID)}
      >
        <Card style={styles.card} elevation={3}>
          <Card.Content>
            <View style={{ flexDirection: "row" }}>
              <View>
              </View>

              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Title>Meeting # {meeting.Meeting.meetingID}</Title>
                  <TouchableOpacity
                    onPress={() => handleMarkAsCompleted(meeting.Meeting.meetingID)}
                    disabled={meeting.Meeting.status.toLowerCase() === 'completed'}
                  >
                    <Title style={{ fontSize: 16, color: meeting.Meeting.status.toLowerCase() === 'completed' ? "gray" : "#25d366", marginLeft: 122, textDecorationLine: 'underline' }}>
                      Mark as completed
                    </Title>
                  </TouchableOpacity>
                </View>

                <Text>Date: {meeting.Meeting.scheduledDate}</Text>
                <Text>
                  Time:{" "}
                  {`${moment(meeting.Meeting.startTime, "HH:mm:ss").format(
                    "h:mm A"
                  )} - ${moment(meeting.Meeting.endTime, "HH:mm:ss").format(
                    "h:mm A"
                  )}`}
                </Text>

                <Text
                  style={{
                    color: getStatusColor(meeting.Meeting.status.toLowerCase()),
                  }}
                >
                  Status: {meeting.Meeting.status.toLowerCase()}
                </Text>

                {/* Add user and DVM information */}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <AppHeaderDvm navigation={navigation}></AppHeaderDvm>
      <View style={{ paddingTop: 10, alignItems: "center" }}>
        <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
          All Your Meetings
        </Title>
      </View>

      <Title
        style={{
          marginLeft: "3%",
          color: "#25d366",
          fontWeight: "700",
          marginTop: "2%",
        }}
      >
        Select by Status
      </Title>

      <View style={styles.chipContainer}>
        {["All", "Scheduled", "In-Progress", "Completed"].map((status) => (
          <Chip
            key={status}
            mode={selectedStatus === status.toLowerCase() ? "outlined" : "flat"}
            onPress={() => handleStatusChange(status)}
            style={{
              backgroundColor:
                selectedStatus === status.toLowerCase()
                  ? "transparent"
                  : "#25d366",
              borderColor:
                selectedStatus === status.toLowerCase()
                  ? "#25d366"
                  : "transparent",
              borderWidth: 1,
              borderRadius: 50,
              padding: 3,
            }}
            textStyle={{
              color:
                selectedStatus === status.toLowerCase() ? "#25d366" : "white",
            }}
          >
            {status}
          </Chip>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {isLoading || !email ? (
          <ActivityIndicator size="large" color="#25d366" margin={200} />
        ) : (
          renderMeetingCards()
        )}
      </ScrollView>
    </View>
  );
};

export default DvmAllMeetings;
