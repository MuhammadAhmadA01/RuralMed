const { Sequelize, literal, fn, col, Op } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");
const Owners = require("../../Models/Owner/Owner");
const Orders = require("../../Models/Order/Order");
const Product = require("../../Models/Product/products");
const Store = require("../../Models/Store/Store");
const createOwner = (req, res) => {
  const { cnic, email } = req.body;

  Owners.findOne({ where: { cnic } })
    .then((existingOwnerCnic) => {
      if (existingOwnerCnic) {
        throw { status: 400, message: "CNIC is already in use" };
      }

      // If CNIC is unique, check for existing email
      return Owners.findOne({ where: { email } }).then((existingOwnerEmail) => {
        if (existingOwnerEmail) {
          throw { status: 400, message: "email is already in use" };
        }

        // If both CNIC and email are unique, create a new owner
        return Owners.create({
          cnic,
          email,
        });
      });
    })
    .then((newOwner) => {
      res.status(201).json({ success: true, newOwner });
    })
    .catch((error) => {
      console.error("Error creating owner:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const addProduct = (req, res) => {
  const { storeId, name, price, description, availableQuantity } = req.body;

  // Check if the specified storeId exists in the stores table
  Store.findByPk(storeId)
    .then((existingStore) => {
      if (!existingStore) {
        throw { status: 400, message: "store not registered" };
      }

      // If the store exists, proceed to create the new product
      return Product.create({
        storeId,
        name,
        price,
        description,
        availableQuantity,
      });
    })
    .then((newProduct) => {
      res.status(201).json(newProduct);
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const viewProfile = (req, res) => {
  const { email } = req.params;
  // Retrieve owner record from the 'owners' table
  Owners.findOne({
    where: { email: email },
    attributes: { exclude: ["id"] },
  })
    .then((ownerRecord) => {
      if (!ownerRecord) {
        return res
          .status(404)
          .json({ error: "owner not found with this email." });
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
              .json({ error: "owner not found with this email." });
          }

          // Combine and send the response
          const combinedResponse = {
            owner: ownerRecord.toJSON(),
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
      console.error("Error retrieving owner record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const viewOrders = (req, res) => {
  const { email } = req.params;

  Orders.findAll({
    where: {
      ownerId: email,
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
const getownerMonthlyStats = (req, res) => {
  const { email } = req.params;
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
          'SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN "orderTotal"-"shippingCharges" ELSE 0 END)'
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
      ownerId: email,
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
              'SUM(CASE WHEN "orderStatus" = \'completed\' AND "dateOfOrder" BETWEEN :start AND :end THEN CASE WHEN "orderTotal" = 0 THEN 0 ELSE ABS("orderTotal" - "shippingCharges" )END ELSE 0 END)'
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
          ownerId: email,
        },
        replacements: { start: startDate, end: endDate },
      });
    })
    .then((currentMonthResults) => {
      currentMonthStats = currentMonthResults.get({ plain: true });
      return Orders.count({
        where: {
          ownerId: email,
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
      res.status(500).json({ error });
    });
};
// storeController.js

const getStoresByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const stores = await Store.findAll({
      where: {
        ownerEmail: email,
      },
    });
    res.status(200).json({ stores, success: true });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
};
const updateOrderStatus = (req, res) => {
  try {
    const { orderID, newStatus } = req.params;
    
    // Check if the provided orderID is valid
    Orders.findByPk(orderID)
      .then((order) => {
        if (!order) {
          throw { status: 404, message: "Order not found" };
        }

        // Update the orderStatus
        return order.update({ orderStatus: newStatus });
      })
      .then((updatedOrder) => {
        res.status(200).json({ success: true, updatedOrder });
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error updating order status:", error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message || "Internal Server Error" });
  }
};
module.exports = {
  createOwner,
  addProduct,
  viewProfile,
  viewOrders,
  getownerMonthlyStats,
  getStoresByEmail,
  updateOrderStatus
};
