import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IP_ADDRESS from "../config/config";

const useNotifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications,setNotificationsData]=useState([])
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const contactNumber = await AsyncStorage.getItem("phone");
        const emailResponse = await fetch(
          `http://${IP_ADDRESS}:5000/get-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contactNumber }),
          }
        );
        const emailData = await emailResponse.json();
          setEmail(emailData.email)
        const notificationsResponse = await fetch(
          `http://${IP_ADDRESS}:5000/notifications/${emailData.email}/Customer`
        );
        const notificationsData = await notificationsResponse.json();
         setNotificationsData(notificationsData) 
        const unreadNotifications = notificationsData.filter(
          (notification) => !notification.isOpenedByCustomer
        );

        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Run only on component mount

  return { notificationCount, notifications, email };
};

export default useNotifications;
