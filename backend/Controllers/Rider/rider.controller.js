const Riders = require('../../Models/Rider/Rider');
const createRider = (req, res) => {
  const { cnic, deliveryFee, email, availabilityStatus } = req.body;
  Riders.findOne({ where: { email } })
    .then(existingRiderEmail => {
      if (existingRiderEmail) {
        
        throw {status:400, message: 'email is already in use' };
      }
      return Riders.findOne({ where: { cnic } })
        .then(existingRiderCnic => {
          if (existingRiderCnic) {
            throw {status:400, message: 'CNIC is already in use' };
          }
        return Riders.create({
            cnic,
            deliveryFee,
            email,
            availabilityStatus,
          });
        });
    })
    .then(newRider => {
      res.status(201).json(newRider);
    })
    .catch(error => {
        console.error('Error creating rider:', error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Internal Server Error' });
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

const viewOrders = (req, res) => {
  const { id } = req.params;

  Orders.findAll({
    where: {
      riderId: id,
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
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = currentDate;

  // Calculate the start and end date of the previous month
  const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  let prevMonthResults;
  let currentMonthStats; // Declare variable outside the scope

  // Earning and number of orders in previous month from current date
  Orders.findOne({
    attributes: [
      [sequelize.literal('SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN "shippingCharges" ELSE 0 END)'), 'prevMonthEarning'],
      [sequelize.literal('COUNT(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN 1 END)'), 'prevMonthOrders'],
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
          [sequelize.literal('SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN "shippingCharges" ELSE 0 END)'), 'currentMonthEarning'],
          [sequelize.literal('COUNT(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN 1 END)'), 'currentMonthOrders'],
   
        ],
        where: {
          riderId,
        },
        replacements: { start: startDate, end: endDate },
      });
    })
    .then((currentMonthResults) => {
currentMonthStats=currentMonthResults.get({ plain: true })
      return Orders.count({
        where: {
          riderId,
          orderStatus: 'in-progress',
          dateOfOrder: {
            [Op.between]: [startDate, endDate],
          },
        },
      })
        .then((inProgressOrders) => {
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
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

module.exports = { createRider,viewProfile,viewOrders,getRiderMonthlyStats };
