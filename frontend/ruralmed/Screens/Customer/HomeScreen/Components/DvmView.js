import { Title, Card } from "react-native-paper";
import { Text, Image, View } from "react-native";
import { styles } from "../styles";
import { FontAwesome5 } from "@expo/vector-icons";

const DvmView = ({ filteredCardsData, navigation }) => {
  const formatTime = (timeString) => {
    const timeComponents = timeString.split(":");
    let hours = parseInt(timeComponents[0]);
    const minutes = timeComponents[1];
    let meridiem = "AM";

    if (hours >= 12) {
      meridiem = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    }

    return `${hours}:${minutes} ${meridiem}`;
  };

  return (
    <>
      <Title style={{ marginLeft: "3%", color: "#25d366", fontWeight: "700" }}>
        Onboard DVMs
      </Title>
      {filteredCardsData.length > 0 ? (
        filteredCardsData
          .reduce((rows, card, idx) => {
            if (idx % 2 === 0) rows.push([]);
            rows[rows.length - 1].push(
              <Card
                onPress={() => {
                    console.log(card)
                    navigation.navigate("BookAppointmentScreen",{dvmInfo:card,dvmsData:filteredCardsData})
                }}
                key={card.dvmID}
                style={styles.cardDvm}
              >
                <Image
                  source={{ uri: `${card.picture}`}}
                  style={styles.cardImageDvm}
                />
                <Title style={styles.titleDvm}>{`Dr. ${card.name}`}</Title>
                <Card.Content style={{ marginTop: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <FontAwesome5
                      name="clock"
                      size={16}
                      color="#25d366"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.cardTextDvm}>
                      {formatTime(card.startTime)} - {formatTime(card.endTime)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <FontAwesome5
                      name="money-bill"
                      size={16}
                      color="#25d366"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.cardTextDvm}>{`Rs. ${card.meetingFee}/-`}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <FontAwesome5
                      name="user-md"
                      size={16}
                      color="#25d366"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.cardTextDvm}>{card.speciality}</Text>
                  </View>
                </Card.Content>
              </Card>
            );
            return rows;
          }, [])
          .map((row, idx) => (
            <View key={idx} style={styles.rowDvm}>
              {row}
            </View>
          ))
      ) : (
        <Text
          style={{
            textAlign: "center",
            marginTop: 150,
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          No DVM Available
        </Text>
      )}
    </>
  );
};
export default DvmView;
