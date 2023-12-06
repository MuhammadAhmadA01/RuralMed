import React, { useState, useEffect } from 'react';
import { View, ScrollView, StatusBar, Switch } from 'react-native';
import { Appbar, Card, Title, Paragraph, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeaderRider from '../../Components/RiderAppHeader';
import IP_ADDRESS from '../../config/config';
const RiderHomeScreen = ({ navigation }) => {
  // Replace these values with the actual data you want to display
  const prevMonthEarning = 1500;
  const prevMonthOrders = 30;
  const currentMonthEarning = 2000;
  const currentMonthOrders = 40;
  const inProgressOrders = 5;
  const [availabilitySwitch, setAvailabilitySwitch] = useState(false);
  const [riderEmail, setRiderEmail] = useState('');

  useEffect(() => {
    // Fetch rider's profile to get availability status
    const fetchRiderProfile = async () => {
      try {
        // Get rider's email from AsyncStorage
        const phone = await AsyncStorage.getItem('phone');
        
        // Get rider's email from the server
        const emailResponse = await fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactNumber: phone,
          }),
        });

        const { email } = await emailResponse.json();
        setRiderEmail(email);

        // Fetch rider's profile based on the obtained email
        const profileResponse = await fetch(`http://${IP_ADDRESS}:5000/get-profile/${email}`);
        console.log(profileResponse)
        const { rider } = await profileResponse.json();
        //console.log(rider)
        // Update the availability switch based on the availability status
        if (rider && rider.availabilityStatus==='Online') {
          setAvailabilitySwitch(true);
        }
        else
        if(rider.availabilityStatus==='Offline')
        {
          setAvailabilitySwitch(false);

        }
      } catch (error) {
        console.error('Error fetching rider profile:', error);
      }
    };

    fetchRiderProfile();
  }, []);
  const updateAvailabilityStatus = async (status) => {
    console.log(riderEmail)
    try {
      const updateStatusResponse = await fetch(`http://${IP_ADDRESS}:5000/${riderEmail}/${status}`, {
        method: 'PUT',
      });

      if (updateStatusResponse.ok) {
        console.log(`Availability status updated to ${status}`);
      } else {
        console.error('Error updating availability status');
      }
    } catch (error) {
      console.error('Error updating availability status:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
<AppHeaderRider navigation={navigation}></AppHeaderRider>
      {/* Monthly Dashboard Heading */}
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Title style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>Your Monthly Dashboard</Title>
      </View>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Title style={{ color: 'black', fontSize: 18 }}>Availability Status</Title>
        <Switch
          value={availabilitySwitch}
          onValueChange={(value) => {
            setAvailabilitySwitch(value);
            const status = value ? 'Online' : 'Offline';
            updateAvailabilityStatus(status);
          }}
          style={{ marginLeft: '45%' }}
          thumbColor={availabilitySwitch ? "#25d366" : "#9E9E9E"}
      
          
        />
      </View>
      {/* Dashboard Items */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: 'black' }}>Current Month Earning</Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 20 }}>{currentMonthEarning}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: 'black' }}>Current Month Orders</Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 20 }}>{currentMonthOrders}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: 'black' }}>In Progress Orders</Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 20 }}>{inProgressOrders}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: 'black' }}>Prev Month Earning</Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 20 }}>{prevMonthEarning}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={{ marginBottom: 16, flex: 1, height: 130 }}>
          <Card.Content>
            <Title style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, color: 'black' }}>Prev Month Orders</Title>
            <Paragraph style={{ textAlign: 'center', fontSize: 20 }}>{prevMonthOrders}</Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default RiderHomeScreen;
