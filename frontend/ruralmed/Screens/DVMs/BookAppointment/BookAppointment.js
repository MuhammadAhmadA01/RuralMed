import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Appbar, Paragraph, TouchableRipple } from "react-native-paper";
import ProfileHeader from "../../User/ProfileView/Components/ProfileHeader";
import { styles } from "./styles";
import useFetchEmail from "../../../utils/useFetchEmail";
import IP_ADDRESS from "../../../config/config";
import DvmListScreen from "./Specialists";
import moment from "moment";
import momentTimeZone from "moment-timezone";
const DvmAppointmentScreen = ({ route, navigation }) => {
  const { dvmInfo, dvmsData } = route.params;
  //console.log(dvmInfo)
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(moment().format("YYYY-MM-DD"));

  // Get the current time
  momentTimeZone.tz.setDefault("Asia/Karachi");

  const currDate = momentTimeZone().format().split("T")[0];
  // Get the current time
  const currTime = momentTimeZone().format("hh:mm A");

  const email = useFetchEmail();
  const timeToMinutes = (time) => {
    const hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1].split(" ")[0]);
    const meridiem = time.split(":")[1].split(" ")[1];
    let totalMinutes = hours * 60 + minutes;
    if (meridiem === "PM" && hours != 12) {
      totalMinutes += 12 * 60; // Add 12 hours if PM
    }
    return totalMinutes;
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    let currentTime = moment(startTime, "hh:mm:ss");
    const endTimeMoment = moment(endTime, "hh:mm:ss");
    while (currentTime.isBefore(endTimeMoment)) {
      const startTime = currentTime.format("hh:mm A");
      currentTime.add(20, "minutes");
      const endTime = currentTime.format("hh:mm A");
      const currentTimeInMinutes = timeToMinutes(currTime);
      const startTimeInMinutes = timeToMinutes(startTime);

      if (
        startTimeInMinutes >= currentTimeInMinutes &&
        currDate ==
          (typeof selectedDay === "object" ? selectedDay.value : selectedDay)
      ) {
        slots.push({
          label: `${startTime} - ${endTime}`,
          value: `${startTime}-${endTime}`,
        });
      } else if (
        currDate !=
        (typeof selectedDay === "object" ? selectedDay.value : selectedDay)
      ) {
        slots.push({
          label: `${startTime} - ${endTime}`,
          value: `${startTime}-${endTime}`,
        });
      }
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:5000/booked-meetings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              date:
                typeof selectedDay === "object"
                  ? selectedDay.value
                  : selectedDay,
              dvmId: dvmInfo.email,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch booked appointments");
        }

        const data = await response.json();

        // Filter out booked slots from the available time slots
        const availableTimeSlots =
          dvmInfo && dvmInfo.startTime && dvmInfo.endTime
            ? generateTimeSlots(dvmInfo.startTime, dvmInfo.endTime).filter(
                (slot) => {
                  return !data.some((appointment) =>
                    moment(appointment.startTime, "hh:mm:ss").isSame(
                      moment(slot.value.split("-")[0], "hh:mm A")
                    )
                  );
                }
              )
            : [];
        setTimeSlots(availableTimeSlots);
      } catch (error) {
        console.error("Error fetching booked appointments:", error);
        // Handle error
      }
    };

    fetchBookedAppointments();
  }, [selectedDay]); // Fetch booked appointments when selectedDay changes

  const handleBookAppointment = async () => {
    try {
      if (!selectedSlot || !selectedDay  ) {
        Alert.alert(
          "Select Time and Day",
          "Please select a time slot and day to proceed."
        );
        return;
      }
if(selectedSlot.value==="No Slots Available")
{
  Alert.alert(
    "Choose Other Day",
    "No slots available for this day. Please choose another date/day"
  );
  return;

}
      // Prepare the data to send in the request body
      const requestData = {
        meetingFee: dvmInfo.meetingFee,
        scheduledDate:
          typeof selectedDay === "object" ? selectedDay.value : selectedDay, // Assuming the selectedDay is in the format 'YYYY-MM-DD'
        startTime: selectedSlot.value.split("-")[0], // Extracting start time from selected slot
        endTime: selectedSlot.value.split("-")[1], // Extracting end time from selected slot
        customerId: email, // Assuming you have access to customerId
        dvmId: dvmInfo.email, // Assuming you have access to dvmId
      };

      // Make the POST request
      const response = await fetch(`http://${IP_ADDRESS}:5000/book-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }
      const resData=await response.json()
      console.log(resData)
      // Appointment booked successfully
      Alert.alert("Success", "Appointment booked successfully");
      const requestDataNotification = {
        meetingID: resData.meeting.meetingID,
        customerId: email, // Assuming you have access to customerId
        dvmId: dvmInfo.email, // Assuming you have access to dvmId
        dateOfNotiifcation: new Date().toLocaleString()
      };
      // Make the POST request
      const responseNotification = await fetch(`http://${IP_ADDRESS}:5000/push-notification-meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestDataNotification),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }
      fetch(`http://${IP_ADDRESS}:5000/send-email-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newMeeting:resData.meeting })
      })
      .then(response => {
        if (response.ok) {
          // Handle success response
          console.log('Order email sent successfully');
        } else {
          // Handle error response
          console.error('Failed to send order email');
        }
      })
      .catch(error => {
        // Handle network errors or exceptions
        console.error('Error sending order email:', error);
      });
      
      
      navigation.replace('HomeCustomer'); // Go back to the previous screen
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert(
        "Error",
        "Failed to book appointment. Please try again later."
      );
    }
  };

  const handleLocationPress = () => {
    const [longitude, latitude] = dvmInfo.clinicLocation.split(",");
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const isOffDay = (day) => {
    return dvmInfo.offDay === day;
  };

  const isPastTimeSlot = (time) => {
    return currTime.isAfter(momentTimeZone(time, "hh:mm A"));
  };

  const generateNextWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, "days").format("YYYY-MM-DD");
      const day = moment().add(i, "days").format("dddd");
      if (!isOffDay(day))
        dates.push({
          label: `${day} - ${date}`,
          value: date,
          isOffDay: isOffDay(day),
        });
    }
    return dates;
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#25d366"></StatusBar>
      <Appbar.Header style={{ backgroundColor: "#25d366" }}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Book Appointment" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
        <View style={{ flex: 1 }}>
          <ProfileHeader user={dvmInfo} isUser={false}></ProfileHeader>
        </View>

        <View>
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.titleHeadingAbout}>About The Doctor</Text>

            <Paragraph style={{ textAlign: "justify" }}>
              {`As a dedicated Doctor of Veterinary Medicine (DVM), I am committed to providing exceptional care to animals of all shapes and sizes. With a focus on ${dvmInfo.speciality}, I strive to deliver comprehensive veterinary services. Whether it's preventive care, diagnostics, surgery, or ongoing treatment, I prioritize the well-being and comfort of every animal.`}
            </Paragraph>
          </View>
          <Text style={styles.titleHeading}>Book an Appointment</Text>
          <Text style={{ marginBottom: 0 }}>{dvmInfo.address}</Text>
          <View style={styles.rowDvmContainer}>
            <View style={styles.filtersContainerDvm}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={generateNextWeekDates()}
                placeholder={selectedDay}
                labelField="label"
                valueField="value"
                value={selectedDay}
                onChange={(value) => setSelectedDay(value)}
              />
            </View>
            <View style={styles.filtersContainerDvm}>
              <Dropdown
                placeholder="Select a Slot"
                data={timeSlots.length>0?timeSlots:[{"label":"No Slots Available","value":"No Slots Available"}]}
                value={selectedSlot}
                onChange={(value) => setSelectedSlot(value)}
                labelField="label"
                valueField="value"
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
              />
            </View>
          </View>
          <TouchableOpacity style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Get Clinic's Location:{" "}
              <Text
                onPress={handleLocationPress}
                style={[
                  {
                    fontSize: 20,
                    marginLeft: "10px",
                    textDecorationLine: "underline",
                    color: "#25d366",
                    fontWeight: "900",
                  },
                ]}
              >
                Click here
              </Text>
            </Text>
          </TouchableOpacity>

          <DvmListScreen
            data={dvmsData}
            navigation={navigation}
            currentDvm={dvmInfo}
          ></DvmListScreen>
        </View>
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleBookAppointment}
        style={styles.button}
      >
        Book Appointment
      </Button>
    </View>
  );
};

export default DvmAppointmentScreen;
