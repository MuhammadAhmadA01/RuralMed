const DVM = require("../../Models/DVM/DVM"); // Assuming the DVM model is defined in a separate file
const User = require("../../Models/User/User");
const { sequelize, DataTypes } = require("../../config/config");
const { Sequelize, literal, fn, col, Op } = require("sequelize");
const Meeting_Notification = require("../../Models/Notifications/Meeting_Notifications");
const Meeting = require("../../Models/Meeting/Meeting");
// Controller function to add data to the DVM table
const addDVM = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      meetingFee,
      availability,
      speciality,
      email,
      startTime,
      endTime,
      offDay,
      clinicLocation,
    } = req.body;

    // Add data to the DVM table using Sequelize's create method
    const dvm = await DVM.create({
      meetingFee,
      availability,
      speciality,
      email,
      startTime,
      endTime,
      offDay,
      clinicLocation,
    });

    // Send a success response
    res.status(201).json({ message: "DVM data added successfully", dvm });
  } catch (error) {
    // Handle errors
    console.error("Error adding DVM data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllDVMs = async (req, res) => {
  try {
    // Fetch all users where role is "DVM"
    const allUsers = await User.findAll({ where: { role: "Dvm" } });

    // Fetch all DVM records from the database
    const allDVMs = await DVM.findAll();
    // Combine DVMs with additional user information
    const combinedDVMs = allDVMs.map((dvm) => {
      // Find corresponding user for the DVM by matching email
      const correspondingUser = allUsers.find(
        (user) => user.email === dvm.email
      );
      // Add additional fields from the user to the DVM object
      return {
        ...dvm.toJSON(),
        picture: correspondingUser.picture,
        cityNearBy: correspondingUser.cityNearBy,
        name: `${correspondingUser.firstName} ${correspondingUser.lastName}`,
      };
    });
    console.log(combinedDVMs);
    // Send the combined DVMs as a response
    res.json(combinedDVMs);
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error fetching all DVMs:", error);
    res.status(500).json({ error: "An error occurred while fetching DVMs" });
  }
};

const getDvmMonthlyStats = (req, res) => {
  const { dvmId } = req.params;

  // Calculate the start and end date of the current month
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endDate = currentDate;

  // Calculate the start and end date of the previous month
  const lastMonthStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastMonthEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );

  let prevMonthResults;
  let currentMonthStats; // Declare variable outside the scope

  // Earning and number of Meetings in previous month from current date
  Meeting.findOne({
    attributes: [
      [
        sequelize.literal(
          'SUM(CASE WHEN "status" = \'completed\' AND "scheduledDate" BETWEEN :start AND :end THEN "meetingFee" ELSE 0 END)'
        ),
        "prevMonthEarning",
      ],
      [
        sequelize.literal(
          'COUNT(CASE WHEN "status" = \'completed\' AND "scheduledDate" BETWEEN :start AND :end THEN 1 END)'
        ),
        "prevMonthMeetings",
      ],
    ],
    where: {
      dvmId,
    },
    replacements: { start: lastMonthStartDate, end: lastMonthEndDate },
  })
    .then((results) => {
      prevMonthResults = results.get({ plain: true });
      // Earning and number of Meetings in current month from 1st date to current date
      return Meeting.findOne({
        attributes: [
          [
            sequelize.literal(
              'SUM(CASE WHEN "status" = \'completed\' AND "scheduledDate" BETWEEN :start AND :end THEN "meetingFee" ELSE 0 END)'
            ),
            "currentMonthEarning",
          ],
          [
            sequelize.literal(
              'COUNT(CASE WHEN "status" = \'completed\' AND "scheduledDate" BETWEEN :start AND :end THEN 1 END)'
            ),
            "currentMonthMeetings",
          ],
        ],
        where: {
          dvmId,
        },
        replacements: { start: startDate, end: endDate },
      });
    })
    .then((currentMonthResults) => {
      currentMonthStats = currentMonthResults.get({ plain: true });
      return Meeting.count({
        where: {
          dvmId,
          status: "Scheduled",
        },
      }).then((inProgressMeetings) => {
        // Construct the final response
        const result = {
          prevMonthEarning: prevMonthResults.prevMonthEarning || 0,
          prevMonthMeetings: prevMonthResults.prevMonthmeetings || 0,
          currentMonthEarning: currentMonthStats.currentMonthEarning || 0,
          currentMonthMeetings: currentMonthStats.currentMonthMeetings || 0,
          inProgressMeetings: inProgressMeetings,
        };

        // Send the response
        res.json(result);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const updateNotifications = async (req, res) => {
  try {
    const { email, role } = req.params;
    // Fetch notifications based on the provided email and role
    const notifications =
      // Update isOpenedBy for the fetched notifications
      await Meeting_Notification.update(
        { [`isOpenedBy${role}`]: true },
        {
          where: {
            [Op.and]: [
              { [`${role.toLowerCase()}Id`]: email },
              { [`isOpenedBy${role}`]: false },
            ],
          },
        }
      );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createNotificationMeeting = async (req, res) => {
  try {
    const notification = await Meeting_Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getNotificationsMeetings = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch notifications based on the provided email and role
    const notifications = await Meeting_Notification.findAll({
      where: {
        [Op.or]: [{ dvmId: email }, { customerId: email }],
      },
    });

    // Update isOpenedBy for the fetched notifications

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching and updating notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllMeetingsByDvmId = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all meetings where dvmId matches
    const meetings = await Meeting.findAll({ where: { dvmId: id } });

    // Array to store the combined data of meetings, users, and DVMS
    const combinedData = [];

    // Loop through each meeting
    for (const meeting of meetings) {
      // Find the user corresponding to the meeting's customerId
      const user = await User.findOne({ where: { email: meeting.customerId } });

      // Combine meeting, user, and DVM data into an object
      const combinedObject = {
        Meeting: meeting,
        User: user,
      };

      // Push the combined object to the array
      combinedData.push(combinedObject);
    }

    // Return the combined data in the response
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export the controller function
module.exports = {
  addDVM,
  getAllDVMs,
  getDvmMonthlyStats,
  updateNotifications,
  createNotificationMeeting,
  getNotificationsMeetings,
  getAllMeetingsByDvmId
};
