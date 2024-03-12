import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Image,ActivityIndicator } from "react-native"; // Import Image component
import { Dropdown } from "react-native-element-dropdown";
import { Card, Title } from "react-native-paper";
import { styles } from "../styles";
import IP_ADDRESS from "../../../../config/config";
import { FontAwesome5 } from "@expo/vector-icons";
import DvmView from "./DvmView";

const CustomerDvms = ({navigation}) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [cities, setCities] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [cardsData, setCardsData] = useState([]);
  const [filteredCardsData, setFilteredCardsData] = useState([]);
  const [isLoading,setIsLoading]=useState(true)
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://${IP_ADDRESS}:5000/get-dvms`);
        const data = await response.json();
       // console.log(data)
        const uniqueCities = Array.from(
          new Set(data.map((dvm) => dvm.cityNearBy))
        );
        const uniqueSpecializations = Array.from(
          new Set(data.map((dvm) => dvm.speciality))
        );

        setCities(["All Cities", ...uniqueCities]);
        setSpecializations(["All Specializations", ...uniqueSpecializations]);
        setCardsData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching DVMs:", error);
        setIsLoading(false);

      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Apply filters to the cardsData and update filteredCardsData
    const applyFilters = () => {
      let filteredData = [...cardsData];
      if (selectedCity && selectedCity.value !== "All Cities") {
        filteredData = filteredData.filter(
          (card) => card.cityNearBy === selectedCity.value
        );
      }
      if (
        selectedSpecialization &&
        selectedSpecialization.value !== "All Specializations"
      ) {
        filteredData = filteredData.filter(
          (card) => card.speciality === selectedSpecialization.value
        );
      }
      setFilteredCardsData(filteredData);
    };

    applyFilters();
  }, [selectedCity, selectedSpecialization, cardsData]); // Add selectedCity, selectedSpecialization, and cardsData as dependencies

  return (
    <>
      <View style={styles.containerDvm}>
        {isLoading?(<ActivityIndicator size="large" color="#25d366"></ActivityIndicator>):(
        <ScrollView
          contentContainerStyle={styles.scrollContainerDvm}
          style={styles.cardsContainerDvm}
        >
          <Title
            style={{ marginLeft: "3%", color: "#25d366", fontWeight: "700" }}
          >
            Filters
          </Title>
          <View style={styles.rowDvmContainer}>
            <View style={styles.filtersContainerDvm}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                placeholder="All Cities"
                searchPlaceholder="Search..."
                search
                labelField="value"
                data={cities.map((city) => ({ value: city }))}
                value={selectedCity}
                valueField="value"
                onChange={(value) => setSelectedCity(value)}
              />
            </View>
            <View style={styles.filtersContainerDvm}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                placeholder="All Specializations"
                searchPlaceholder="Search..."
                search
                labelField="value"
                data={specializations.map((specialization) => ({
                  value: specialization,
                }))}
                value={selectedSpecialization}
                valueField="value"
                onChange={(value) => {
                  setSelectedSpecialization(value);
                }}
              />
            </View>
          </View>

 <DvmView navigation={navigation} filteredCardsData={filteredCardsData}></DvmView>
        </ScrollView>
        )}
      </View>
    </>
  );
};

export default CustomerDvms;
