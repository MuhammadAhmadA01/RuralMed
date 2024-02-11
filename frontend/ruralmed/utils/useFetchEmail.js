import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from '../config/config';

const useFetchEmail = () => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const contactNumber = await AsyncStorage.getItem('phone');
        const response = await fetch(`http://${IP_ADDRESS}:5000/get-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contactNumber }),
        });
        const data = await response.json();
        setEmail(data.email);
      } catch (error) {
        console.log('Error fetching email:', error);
      }
    };

    fetchEmail();
  }, []);

  return email;
};

export default useFetchEmail;
