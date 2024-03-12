import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TotalCountCard = ({ title, count, backgroundColor }) => {
  return (
    <View style={[styles.cardContainer]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.countContainer}>
        <View style={[styles.countCircle,{ backgroundColor }]}>
          <Text style={styles.count}>{count}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '49%',
    marginTop:10,
    padding: 10,
    borderRadius: 10,
   // backgroundColor:'white'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft:30

  },
  countContainer: {
    alignItems: 'center',
  },
  countCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    padding:10,
    backgroundColor:'white',
    borderRadius:50
  },
});

export default TotalCountCard;
