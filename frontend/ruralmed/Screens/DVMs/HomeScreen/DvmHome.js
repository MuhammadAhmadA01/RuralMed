import React, { useState, useEffect } from "react";
import AppHeaderRider from "../../../Components/Rider/RiderAppHeader";
import {
  View,
  Switch,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import {
  Title,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../../../config/config";
import CardsView from "../../../Components/User/CardsView";
import AppHeaderDvm from "../../../Components/DVM/DvmHeader";
const DvmHomeScreen=({navigation})=>{
    const [availabilitySwitch, setAvailabilitySwitch] = useState(false);
  const [dvmEmail, setDvmEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [prevMonthEarning, setPrevMonthEarning] = useState(0);
  const [prevMonthMeetings, setPrevMonthMeetings] = useState(0);
  const [currentMonthEarning, setCurrentMonthEarning] = useState(0);
  const [currentMonthMeetings, setCurrentMonthMeetings] = useState(0);
  const [inProgressMeetings, setInProgressMeetings] = useState(0);


  useEffect(() => {
    const fetchDvmData = async () => {
      try {
        const phone = await AsyncStorage.getItem("phone");
        const emailResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contactNumber: phone,
            }),
          }
        );
        const { email } = await emailResponse.json();
        console.log(email)
        const statsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-dvm-stats/${email}`
        );
        const statsData = await statsResponse.json();
        setPrevMonthEarning(statsData.prevMonthEarning);
        setPrevMonthMeetings(statsData.prevMonthMeetings);
        setCurrentMonthEarning(statsData.currentMonthEarning);
        setCurrentMonthMeetings(statsData.currentMonthMeetings);
        setInProgressMeetings(statsData.inProgressMeetings);
        setDvmEmail(email);
        console.log('aim',email)
        const profileResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-dvm-profile/${email}`
        );
        const { dvm } = await profileResponse.json();
        console.log(dvm)
        if (dvm && dvm.availability) {
          setAvailabilitySwitch(true);
        } else if (dvm && dvm.availability) {
          setAvailabilitySwitch(false);
        }
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching dvm data:", error);
        setLoading(false); // Set loading to false on error as well
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchDvmData();
  }, []);
  const updateAvailabilityStatus = async (status) => {
    try {
      const updateStatusResponse = await fetch(
        `http://${IP_ADDRESS}:5000/update-availability/${dvmEmail}/${status}`,
        {
          method: "PUT",
        }
      );
      if (updateStatusResponse.ok) {
        console.log(`Availability status updated to ${status}`);
      } else 
        console.error("Error updating availability status");
    } catch (error) {
      console.error("Error updating availability status:", error);
    }
  };
  if (loading) 
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#25d366" />
      </View>
    );
    return (
        <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#25d366"></StatusBar>
      <AppHeaderDvm navigation={navigation}></AppHeaderDvm>
          <View style={{ padding: 16, alignItems: "center" }}>
            <Title style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
              Your Monthly Dashboard
            </Title>
          </View>
          <View style={{ padding: 16, flexDirection: "row", alignItems: "center" }}>
            <Title style={{ color: "black", fontSize: 18 }}>
              Availability Status
            </Title>
            <Switch
              value={availabilitySwitch}
              onValueChange={(value) => {
                setAvailabilitySwitch(value);
                const status = value ? "Online" : "Offline";
                updateAvailabilityStatus(status);
              }}
              style={{ marginLeft: "45%" }}
              thumbColor={availabilitySwitch ? "#25d366" : "#9E9E9E"}
            />
          </View>
          <CardsView role='Dvm' inProgressOrders={inProgressMeetings} prevMonthEarning={prevMonthEarning} prevMonthOrders={prevMonthMeetings} currentMonthEarning={currentMonthEarning} currentMonthOrders={currentMonthMeetings} ></CardsView>
        </View>
      );
}
export default DvmHomeScreen;