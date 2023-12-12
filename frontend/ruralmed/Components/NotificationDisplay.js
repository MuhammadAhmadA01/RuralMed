import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Title } from "react-native-paper";
import IP_ADDRESS from "../config/config";

const NotificationsDisplay = ({
  notifications,
  onClose,
  isVisible,
  role,
  navigation,
}) => {
  const groupedNotifications = groupByDate(notifications);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.contentContainer}>
          <Title style={styles.modalTitle}>My Notifications</Title>

          {groupedNotifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>
              No notifications yet.
            </Text>
          ) : (
            <FlatList
              style={styles.flatList}
              data={groupedNotifications}
              keyExtractor={(item) => item.notifications[0].notificatonID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleNotificationPress(item, role)}
                >
                  <NotificationGroup
                    role={role}
                    date={item.date}
                    notifications={item.notifications}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const handleNotificationPress = async (
  item,
  role,
  setSelectedNotification,
  navigation
) => {
  try {
    // Make a fetch call to update notification status
    const response = await fetch(
      `http://${IP_ADDRESS}:5000/notifications/${item.notificatonID}/${role}`,
      {
        method: "PUT", // Assuming you are using the PUT method
      }
    );

    if (response.ok) {
      // Handle success, e.g., refresh notifications or navigate to a new screen
      setSelectedNotification(item);
      navigation.replace("NotificationOrderDetails", {
        orderID: item.orderID,
        role: role,
      });
    } else {
      console.error("Failed to update notification status");
    }
  } catch (error) {
    console.error("Error updating notification status:", error);
  }
};
const parseOrderDate = (dateString) => {
  const orderDate = new Date(dateString);

  // Format the date (e.g., "2023-12-14")
  const date = orderDate.toISOString().split("T")[0];

  // Format the time (e.g., "14:16:44")
  const time = orderDate.toISOString().split("T")[1].split(".")[0];

  // Format the time in 12-hour format with AM/PM (e.g., "02:16 PM")
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return {
    date,
    time,
    formattedTime,
  };
};

const NotificationGroup = ({ date, notifications, role, navigation }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{date}</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificatonID}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              handleNotificationPress(
                item,
                role,
                setSelectedNotification,
                navigation
              )
            }
          >
            <View
              style={[
                styles.notificationItem,
                item[`statusOf${role}`] === "Unread" && {
                  backgroundColor: "#BFD6C8",
                },
                selectedNotification &&
                  selectedNotification.notificatonID === item.notificatonID && {
                    borderColor: "green",
                    borderWidth: 2,
                  },
              ]}
            >
              <Text
                style={{ color: "black" }}
              >{`You got an order. Order # is ${item.orderID}`}</Text>
              <Text
                style={[
                  styles.notificationTime,
                  {
                    color:
                      item[`statusOf${role}`] === "Unread" ? "red" : "green",
                  },
                ]}
              >
                {item[`statusOf${role}`]}
              </Text>
              <Text style={styles.notificationTime}>
                {parseOrderDate(item.dateOfNotiifcation).formattedTime}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const groupByDate = (notifications) => {
  const grouped = notifications.reduce((acc, notification) => {
    const date = notification.dateOfNotiifcation.split("T")[0];
    acc[date] = acc[date] || [];
    acc[date].push(notification);

    return acc;
  }, {});

  // Sort notifications within each group by time
  Object.keys(grouped).forEach((date) => {
    grouped[date].sort(
      (a, b) =>
        new Date(b.dateOfNotiifcation).getTime() -
        new Date(a.dateOfNotiifcation).getTime()
    );
  });

  const uniqueDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );
  const sortedGroups = uniqueDates.map((date) => ({
    date,
    notifications: grouped[date],
  }));

  return sortedGroups;
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    maxHeight: 400,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  notificationItem: {
    padding: 10,
    marginVertical: 2,
    borderRadius: 5,
  },
  notificationTime: {
    color: "gray",
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 7,
  },
  noNotificationsText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  flatList: {
    flexGrow: 1,
  },
});

export default NotificationsDisplay;
