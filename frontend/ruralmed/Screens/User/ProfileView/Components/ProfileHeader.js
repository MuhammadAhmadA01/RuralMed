import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import styles from '../Styles/styles';
import { Ionicons } from '@expo/vector-icons';
const ProfileHeader = ({ user, onUpdatePicture,isUser }) => {
  // Function to handle image selection from gallery
  const handleImageSelection = async () => {
    try {
      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // If an image is selected, update the profile picture
        onUpdatePicture(result.uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  return (
    <View style={styles.imageContainer}>
      {/* Display profile picture */}
      {isUser &&
      <View>
      <TouchableOpacity onPress={handleImageSelection}>
        <Avatar.Image
          size={150}
          source={{ uri: user.picture }}
          style={styles.avatar}
        >
        {/* Edit icon/button */}
          </Avatar.Image>
          <View style={styles.editIconContainer}>
          <Ionicons name="md-camera" size={30} color="white"   />
          </View>
      </TouchableOpacity>
      
      <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text></View>
  }
      {!isUser &&
    <View style={{ alignItems: 'center' }}>
    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Avatar.Image
        size={100}
        source={{ uri: user.picture }}
        style={{ marginBottom: 2 }}
      />
      {/* Edit icon/button */}
    </TouchableOpacity>
    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: 'center' }}>{`Dr. ${user.name}`}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Ionicons name="location" size={20} color="black" style={{ marginRight: 5 }} />
      <Text style={{ fontSize: 16 }}>{`${user.cityNearBy.charAt(0).toUpperCase() + user.cityNearBy.slice(1)}, Pakistan`}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor:'#0F5132',borderRadius: 50, height:25, width:60 }}>
      <Ionicons name="star" size={17} color="gold" style={{ marginLeft: 5 }} />
        <Text style={{ color: "white", marginLeft: 5, marginRight: 0 }}>4.2</Text>
     </View>
  </View>
  
}
    </View>
  );
};

export default ProfileHeader;
