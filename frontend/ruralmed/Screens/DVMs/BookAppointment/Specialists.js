import React, { useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const DvmListScreen = ({ data, currentDvm, navigation }) => {
  // Filter the DVMs based on the speciality
  console.log(currentDvm)
  const filteredData = data.filter(dvm => dvm.speciality === currentDvm.speciality && dvm.dvmID!=currentDvm.dvmID );
  console.log(filteredData)

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
       {filteredData.length>0 && <Text style={styles.titleHeadingAbout}>Other Specialists</Text>
}  
      {filteredData.map(dvm => (
        <TouchableOpacity onPress={() => navigation.replace('BookAppointmentScreen', { dvmInfo:dvm,dvmsData:data })} key={dvm.dvmId}>
          <View style={styles.card}>
            <Image source={{ uri: dvm.picture }} style={styles.avatar} />
            <View style={styles.details}>
              <Text style={styles.name}>{`Dr. ${dvm.name}`}</Text>
              <Text style={styles.specialization}>{dvm.speciality}</Text>
              <Text style={styles.experience}>{`Experience: ${dvm.experience} Years`}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom:40
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: '#ffff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    marginTop:20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'#25d366'
  },
  specialization: {
    fontSize: 16,
    marginBottom: 3,
  },
  experience: {
    fontSize: 14,
    color: '#25d366',
  },
  titleHeadingAbout: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 0,
    textAlign: "center",
    color:'#25d366'
  },
  
});

export default DvmListScreen;
