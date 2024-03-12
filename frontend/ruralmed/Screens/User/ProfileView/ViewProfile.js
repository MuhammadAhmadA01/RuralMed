import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, Alert } from "react-native";
import { Appbar, Title } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import AppHeaderRider from "../../../Components/Rider/RiderAppHeader";
import ProfileHeader from "././Components/ProfileHeader";
import DetailItem from "./Components/DetailItem";
import MapSelect from "././Components/MapSelect";
import styles from "./Styles/styles";
import IP_ADDRESS from "../../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TotalCountCard from "./Components/TotalCountCard";
import { useRef } from "react";
import OwnerAppHeader from '../../../Components/Owner/OwnerAppHeader'
import AppHeaderCustomer from "../../../Components/Customer/AppHeaderCustomer";
import AppHeaderDvm from "../../../Components/DVM/DvmHeader";
const ProfileScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const [order, setOrderCount] = useState(0); // State to track order count
  const [review, setReviewCount] = useState(0); // State to track review count
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [userEmail, setUserEmail] = useState(null);

  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };
  const isInitialMount = useRef(true); // Ref to track initial mount

  useEffect(() => {
    if (!isInitialMount.current && isFocused) {
      // Check if it's not the initial mount
      const fetchData = async () => {
        const updateLocation = await fetch(
          `http://${IP_ADDRESS}:5000/update-location`,
          {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
              address: `${selectedLocation.longitude},${selectedLocation.latitude}`,
              userEmail
            }),
          }
        );
        const res=await updateLocation.json()
        if(res.success)
        {
            Alert.alert("Success", "Location Updated Successfully");
            return;
        }
              };
  fetchData();
    } else {
      isInitialMount.current = false;
    }
  }, [selectedLocation, isFocused]);

  useEffect(() => {
    const fetchProfile = async () => {
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
        const userResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-user-profile/${email}`
        );
        const userData = await userResponse.json();
        setUser(userData);
        setUserEmail(email);
        let url=''
        if(role.role!=='Dvm')
        
        url=
        `http://${IP_ADDRESS}:5000/get-count-of-orders`
        else
        
        url=
        `http://${IP_ADDRESS}:5000/get-meetings-counts`
        const countResponse = await fetch(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              role: role.role, // Assuming the role is passed in route params
            }),
          }
        );
        const res = await countResponse.json();
        
        setReviewCount(res.reviewedOrders);
        setOrderCount(res.totalOrders);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchProfile();
  }, []);

  const role = route.params;
  const [editingField, setEditingField] = useState(null);
  const [editing, setEditing] = useState({});
  const [user, setUser] = useState({});

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleUpdate = async (field, value) => {
    try {
      // Make a POST request to update the field
      const response = await fetch(`http://${IP_ADDRESS}:5000/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: field,
          updatedValue: user[field],
          email: userEmail, 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        AsyncStorage.setItem("phone", user["contactNumber"]);
        Alert.alert("Success", "Field updated successfully");
        setEditingField(null);
      } else {
        Alert.alert("Error", data.error || "Failed to update field");
      }
    } catch (error) {
      console.error("Error updating field:", error);
      Alert.alert("Error", "Failed to update field");
    }
  };
  const handleUpdatePicture = async (uri) => {
    try {
      const name = new Date().getTime() + "_profile";
      const type = "image/jpg";
      const newFormData = new FormData();
      newFormData.append("email", userEmail);
      newFormData.append("profile", { name, uri, type });

      fetch(`http://${IP_ADDRESS}:5000/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "multipart/form-data",
        },
        body: newFormData,
      })
        .then((response) => response.json())
        .then((data) => {
          setUser({ ...user, picture: uri });

          if (data.success) {
            Alert.alert("Success", "Profile Picture Updated");
          } else {
            Alert.alert("Error", "Could Not Update Image");
            return;
          }
        })
        .catch((error) => {
          Alert.alert("Error uploading image:", error.message);
          return;
        });
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };
  console.log(role.role)
  return (
    <>
      {role.role === "Rider" && (
        <AppHeaderRider navigation={navigation}></AppHeaderRider>
      )}
      {role.role === "Dvm" && (
        <AppHeaderDvm navigation={navigation}></AppHeaderDvm>
      )}
      
      {role.role === "Owner" && (
        <OwnerAppHeader navigation={navigation}></OwnerAppHeader>
      )}
      
      {role.role === "Customer" && (
     <>
        <AppHeaderCustomer isProfile={true} navigation={navigation}></AppHeaderCustomer>
        </>
      )}
      {loading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator
            size="large"
            color="#25d366"
            style={{ marginTop: 320 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            {/* Profile header */}
            <ProfileHeader user={user} isUser={true} onUpdatePicture={handleUpdatePicture} />
            <View style={styles.totalCountContainer}>
              <TotalCountCard
                title= {role.role !=="Dvm" ? ' Total Orders':'Total Meetings'}
                count={order >= 10 ? order : "0" + order}
                backgroundColor="yellow"
              />
              <TotalCountCard
                title="Total Reviews"
                count={review >= 10 ? review : "0" + review}
                backgroundColor="pink"
              />
            </View>
            <View style={styles.profileInfo}>
              {/* Profile info */}
              <Title style={{ fontSize: 25, marginTop: 40, fontWeight: "700" }}>
                My Details
              </Title>
              <View style={styles.detailsContainer}>
                <DetailItem
                  label="Email"
                  value={user.email}
                  editingField={editingField === "email"}
                  handleEdit={handleEdit}
                  handleUpdate={(value) => handleUpdate("email", value)}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
                <DetailItem
                  label="Contact Number"
                  value={user.contactNumber}
                  editingField={editingField === "contactNumber"}
                  handleEdit={() => handleEdit("contactNumber")}
                  handleUpdate={(value) => handleUpdate("contactNumber", value)}
                  onChangeText={(text) =>
                    setUser({ ...user, contactNumber: text })
                  }
                />
                <DetailItem
                  label="City"
                  value={user.cityNearBy}
                  editingField={editingField === "cityNearBy"}
                  handleEdit={() => handleEdit("cityNearBy")}
                  handleUpdate={(value) => handleUpdate("cityNearBy", value)}
                  onChangeText={(text) =>
                    setUser({ ...user, cityNearBy: text })
                  }
                />
                <MapSelect
                  navigation={navigation}
                  handleLocationSelection={handleLocationSelection}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ProfileScreen;
