import React from 'react';
import { Appbar, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../../../Components/Cart/CartSlice';
import { useState } from 'react';
const Menubar = ({   navigation }) => {
  
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
 
  const handleLogout = async () => {
    setMenuVisible(false);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('phone');

    dispatch(clearCart());
    navigation.replace('login');
  };

  return (
    <>

      {/* Appbar/Header */}
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          style={{ marginTop: '18%', width: '50%', height: '30%' }}
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
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('CustomersAllOrders')}}
            title="My Orders"
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '5%' }}
            onPress={() => console.log('Item 3')}
            title="My Meetings"
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '3%' }}
            onPress={() => console.log('Item 4')}
            title="My Prescriptions"
          />
          <Menu.Item
            style={{ alignItems: 'center', paddingLeft: '17%' }}
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>
    </>
  );
};

export default Menubar;
