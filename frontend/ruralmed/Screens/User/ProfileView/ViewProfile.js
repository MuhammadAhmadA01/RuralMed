import React, { useEffect, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AppHeaderRider from '../../../Components/Rider/RiderAppHeader';
import ProfileHeader from '././Components/ProfileHeader';
import DetailItem from './Components/DetailItem';
import MapSelect from '././Components/MapSelect';
import styles from './Styles/styles';
import IP_ADDRESS from '../../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [userEmail,setUserEmail]=useState(null)
  const handleLocationSelection = (coordinates) => {
    setSelectedLocation(coordinates);
  };

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
        setUserEmail(email)
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
          email: userEmail, // Assuming email is used as a unique identifier
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update the user state with the new value
        // Show an alert on successful update
        AsyncStorage.setItem("phone", user['contactNumber']);
        Alert.alert('Success', 'Field updated successfully');
        // Reset editing field
        setEditingField(null);
      } else {
        // Show an alert on error
        Alert.alert('Error', data.error || 'Failed to update field');
      }
    } catch (error) {
      console.error("Error updating field:", error);
      // Show an alert on error
      Alert.alert('Error', 'Failed to update field');
    }
  };
  
  return (
    <>
      {role.role === "Rider" && <AppHeaderRider  navigation={navigation}></AppHeaderRider>}
      {loading ? (
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#25d366" style={{marginTop:320}} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            {/* Profile header */}
            <ProfileHeader user={user} />
            <View style={styles.profileInfo}>
              {/* Profile info */}
              <Title style={{fontSize:25, marginTop:40, fontWeight:"700"}}>My Details</Title>
              <View style={styles.detailsContainer}>
                <DetailItem
                  label="Email"
                  value={user.email}
                  editingField={editingField === 'email'}
                  handleEdit={handleEdit}
                  handleUpdate={(value) => handleUpdate('email', value)}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
                <DetailItem
                  label="Contact Number"
                  value={user.contactNumber}
                  editingField={editingField === 'contactNumber'}
                  handleEdit={() => handleEdit('contactNumber')}
                  handleUpdate={(value) => handleUpdate('contactNumber', value)}
                  onChangeText={(text) => setUser({ ...user, 'contactNumber': text })}
                />
                <DetailItem
                  label="City"
                  value={user.cityNearBy}
                  editingField={editingField === 'cityNearBy'}
                  handleEdit={() => handleEdit('cityNearBy')}
                  handleUpdate={(value) => handleUpdate('cityNearBy', value)}
                  onChangeText={(text) => setUser({ ...user, 'cityNearBy': text })}
                />
                <MapSelect navigation={navigation} handleLocationSelection={handleLocationSelection} />
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ProfileScreen;
