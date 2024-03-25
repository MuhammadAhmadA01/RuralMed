import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Text, Title } from "react-native-paper";

// Move the function outside the component

const NotificationGroup = ({ date, notifications, onPress }) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupTitle}>{date}</Text>

    <FlatList
      data={notifications}
      keyExtractor={(item) => item.notificationID}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={onPress} key={item.notificationID}>
          <View
            style={[
              styles.notificationItem,
              item.statusOfCustomer === "Unread" && {
                backgroundColor: "#BFD6C8",
              },
            ]}
          >
            <Text
              style={{
                color: item.statusOfCustomer === "Unread" ? "black" : "black",
              }}
            >
              {item.orderID &&`You placed an order. Order # is ${item.orderID}`}
              {item.meetingID &&`Your Meeting is Scheduled. Meeting # is ${item.meetingID}`}

            </Text>
            <Text
              style={[
                styles.notificationTime,
                { color: item.statusOfCustomer === "Unread" ? "red" : "green" },
              ]}
            >
              {item.statusOfCustomer}
            </Text>
            <Text style={styles.notificationTime}>
              {parseOrderDate(item.dateOfNotiifcation).formattedTime}
            </Text>
          </View>
          <View style={styles.divider} />
        </TouchableOpacity>
      )}
    />
  </View>
);
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
  },{ timeZone: "Asia/Karachi" });

  return {
    date,
    time,
    formattedTime,
  };
};
// Inside the NotificationsDisplay component

const NotificationsDisplay = ({ notifications, onClose }) => {
  // Function to group notifications by date (similar to the existing one)

  const groupedNotifications = groupByDate(notifications);
  console.log(notifications)
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {groupedNotifications && (
          <View style={styles.contentContainer}>
            {groupedNotifications.length === 0 ? (
              <Text style={styles.noNotificationsText}>
                No notifications yet.
              </Text>
            ) : (
              <>
                <Title style={styles.modalTitle}>My Notifications</Title>

                <FlatList
                  data={groupedNotifications}
                  keyExtractor={(item) => item.notifications}
                  renderItem={({ item }) => (
                    <NotificationGroup
                      key={item.notifications.map((el)=>el.notificationID)}
                      date={item.date}
                      notifications={item.notifications}
                      onPress={() =>{}}
                    />
                  )}
                />
              </>
            )}
          </View>
        )}
      </View>
    </Modal>
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
  console.log(grouped)
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
    maxHeight: 400, // Set a fixed height for the modal
    padding: 16,
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
    fontSize: 22, // Adjust the font size as needed
    fontWeight: "bold",
    textAlign: "center", // Center the text
    marginTop: 5,
  },

  notificationItem: {
    padding: 10,
    marginVertical: 5,
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
});

export default NotificationsDisplay;
