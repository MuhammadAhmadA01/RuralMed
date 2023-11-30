import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { Appbar, Card, Title, Paragraph, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppHeaderRider from '../../Components/RiderAppHeader';

const RiderHomeScreen = ({ navigation }) => {
  // Replace these values with the actual data you want to display
  const prevMonthEarning = 1500;
  const prevMonthOrders = 30;
  const currentMonthEarning = 2000;
  const currentMonthOrders = 40;
  const inProgressOrders = 5;

  return (
    <View style={{ flex: 1 }}>
<AppHeaderRider navigation={navigation}></AppHeaderRider>
      {/* Monthly Dashboard Heading */}
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Title style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>Your Monthly Dashboard</Title>
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
