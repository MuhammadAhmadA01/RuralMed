import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, Title } from 'react-native-paper';
import styles from '../Styles/styles';

const ProfileHeader = ({ user }) => {
  return (
    <View style={styles.imageContainer}>
      <Avatar.Image
        size={150}
        source={{ uri: user.picture }}
        style={styles.avatar}
      />
      <Text style={styles.userName}>{`${user.firstName} ${user.lastName}`}</Text>
    </View>
  );
};

export default ProfileHeader;
