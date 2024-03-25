const Riders = require("../../Models/Rider/Rider");
const USER = require("../../Models/User/User");
const Orders = require("../../Models/Order/Order");
const { Sequelize, literal, fn, col, Op } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");

const createRider = (req, res) => {
  const { cnic, deliveryFee, email, availabilityStatus, workingArea } =
    req.body;
  Riders.findOne({ where: { email } })
    .then((existingRiderEmail) => {
      if (existingRiderEmail) {
        throw { status: 400, message: "email is already in use" };
      }
      return Riders.findOne({ where: { cnic } }).then((existingRiderCnic) => {
        if (existingRiderCnic) {
          throw { status: 400, message: "CNIC is already in use" };
        }
        return Riders.create({
          cnic,
          deliveryFee,
          email,
          availabilityStatus,
          workingArea,
        });
      });
    })
    .then((newRider) => {
      res.status(201).json({ success: true, newRider });
    })
    .catch((error) => {
      console.error("Error creating rider:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const viewProfile = (req, res) => {
  const { email } = req.params;
  // Retrieve rider record from the 'riders' table
  Riders.findOne({
    where: { email: email },
    attributes: { exclude: ["id"] },
  })
    .then((riderRecord) => {
      if (!riderRecord) {
        return res
          .status(404)
          .json({ error: "rider not found with this email." });
      }

      // Retrieve user record from the 'users' table
      USER.findOne({
        where: { email: email },
        attributes: { exclude: ["password", "role"] },
      })
        .then((userRecord) => {
          if (!userRecord) {
            return res
              .status(404)
              .json({ error: "rider not found with this email." });
          }

          // Combine and send the response
          const combinedResponse = {
            rider: riderRecord.toJSON(),
            user: userRecord.toJSON(),
          };

          res.status(200).json(combinedResponse);
        })
        .catch((error) => {
          console.error("Error retrieving user record:", error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    })
    .catch((error) => {
      console.error("Error retrieving rider record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const updateAvailabilityStatus = async (req, res) => {
  const { email, status } = req.params;

  try {
    // Find the rider in the Rider table based on the provided email
    await Riders.update({ availabilityStatus: status }, { where: { email } });

    // Fetch the updated rider after the update
    // Return the updated rider
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating availabilityStatus:", error);
    return res.status(500).json({
      error: "An error occurred while updating availabilityStatus",
      success: false,
    });
  }
};
const getRiderProfile = async (req, res) => {
  const { email } = req.params;
  try {
    // Find the rider in the Rider table based on the provided email
    const rider = await Riders.findOne({
      where: { email },
    });

    // If the rider is not found, return an error
    if (!rider) {
      return res.status(404).json({ error: "Rider not found", success: false });
    }

    // Return the rider's profile
    return res.status(200).json({ rider, success: true });
  } catch (error) {
    console.error("Error getting rider profile:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while getting rider profile" });
  }
};
const viewOrders = (req, res) => {
  const { email } = req.params;
  Orders.findAll({
    where: {
      riderId: email,
    },
  })
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const getRiderMonthlyStats = (req, res) => {
  const { riderId } = req.params;

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

  // Earning and number of orders in previous month from current date
  Orders.findOne({
    attributes: [
      [
        sequelize.literal(
          'SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN "shippingCharges" ELSE 0 END)'
        ),
        "prevMonthEarning",
      ],
      [
        sequelize.literal(
          'COUNT(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN 1 END)'
        ),
        "prevMonthOrders",
      ],
    ],
    where: {
      riderId,
    },
    replacements: { start: lastMonthStartDate, end: lastMonthEndDate },
  })
    .then((results) => {
      prevMonthResults = results.get({ plain: true });
      // Earning and number of orders in current month from 1st date to current date
      return Orders.findOne({
        attributes: [
          [
            sequelize.literal(
              'SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN "shippingCharges" ELSE 0 END)'
            ),
            "currentMonthEarning",
          ],
          [
            sequelize.literal(
              'COUNT(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN 1 END)'
            ),
            "currentMonthOrders",
          ],
        ],
        where: {
          riderId,
        },
        replacements: { start: startDate, end: endDate },
      });
    })
    .then((currentMonthResults) => {
      currentMonthStats = currentMonthResults.get({ plain: true });
      return Orders.count({
        where: {
          riderId,
          orderStatus: "in-progress",
          dateOfOrder: {
            [Op.between]: [startDate, endDate],
          },
        },
      }).then((inProgressOrders) => {
        // Construct the final response
        const result = {
          prevMonthEarning: prevMonthResults.prevMonthEarning || 0,
          prevMonthOrders: prevMonthResults.prevMonthOrders || 0,
          currentMonthEarning: currentMonthStats.currentMonthEarning || 0,
          currentMonthOrders: currentMonthStats.currentMonthOrders || 0,
          inProgressOrders,
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

module.exports = {
  createRider, // rider ki additional information
  viewProfile, // rider ki profile 
  viewOrders, // rider apny order view kr raha ho ga
  getRiderMonthlyStats, // rider dashboard
  updateAvailabilityStatus, // rider apni availability ko show kr raha ho ga
  getRiderProfile, // getting rider profile
};
