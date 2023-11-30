// AppHeader.js
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppHeaderRider = ({navigation}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = async () => {
    try {
      setMenuVisible(false);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('phone');
      navigation.navigate('login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <>
      <StatusBar backgroundColor="#25d366" barStyle="light-content" />
      <Appbar.Header style={{ backgroundColor: '#25d366' }}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          style={{ marginTop: '2%', width: '50%', height: '30%' }}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          <Menu.Item
            title="MENU"
            style={{ alignItems: 'center', marginLeft: '12%' }}
            titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '5%' }}
            onPress={() => console.log('Item 1')}
            title="My Profile"
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '5%' }}
            onPress={() => {console.log('Item 2')}
            }
            title="My Orders"
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '17%' }}
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>
        <Appbar.Content title="RuralMed" style={{ alignItems: 'center' }} />
        <Appbar.Action
          icon="bell"
          onPress={() => console.log('Notification pressed')}
        />
      </Appbar.Header>
    </>
  );
};

export default AppHeaderRider;
