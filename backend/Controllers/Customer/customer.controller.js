const { Sequelize } = require("sequelize");
const { sequelize, DataTypes } = require("../../config/config");
const { Op, literal, fn, col } = require("sequelize");

const Prescription = require("../../Models/Prescription/prescription");
const Customers = require("../../Models/Customer/Customer");
const prescription = require("../../Models/Prescription/prescription");
const Product = require("../../Models/Product/products");
const Orders = require("../../Models/Order/Order");
const USER = require("../../Models/User/User");
const Rider = require("../../Models/Rider/Rider");
const Store = require("../../Models/Store/Store");
const createCustomer = (req, res) => {
  const { cnic, email, deliveryFee } = req.body;

  Customers.findOne({ where: { cnic } })
    .then((existingCustomerCnic) => {
      if (existingCustomerCnic) {
        throw { status: 400, message: "CNIC is already in use" };
      }

      // If CNIC is unique, check for existing email
      return Customers.findOne({ where: { email } }).then(
        (existingCustomerEmail) => {
          if (existingCustomerEmail) {
            throw { status: 400, message: "email is already in use" };
          }

          // If both CNIC and email are unique, create a new customer
          return Customers.create({
            cnic,
            email,
            deliveryFee,
          });
        }
      );
    })
    .then((newCustomer) => {
      res.status(201).json({ success: true, newCustomer });
    })
    .catch((error) => {
      console.error("Error creating customer:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const createPrescription = (req, res) => {
  const { customerEmail, duration } = req.body;

  prescription
    .create({
      customerEmail,
      duration,
      picture: req.file.filename, // Multer stores the uploaded file in req.file
    })
    .then((newPrescription) => {
      res.status(201).json(newPrescription);
    })
    .catch((error) => {
      console.error("Error creating prescription:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const placeOrder = (req, res) => {
  const {
    customerID,
    riderId,
    ownerId,
    shippingCharges,
    orderStatus,
    isPrescription,
    orderDetails,
  } = req.body;
  let calculatedOrderTotal;

  // Validate that quantity is not more than availableQuantity for each product
  const validateQuantity = () => {
    return Promise.all(
      orderDetails.map((detail) =>
        Product.findByPk(detail.prodId).then((product) => {
          if (!product || detail.quantity > product.availableQuantity) {
            throw {
              status: 400,
              message:
                "Invalid product or quantity exceeds available quantity.",
            };
          }
        })
      )
    );
  };

  // Calculate orderTotal by adding all subtotals and shipping charges
  const calculateOrderTotal = () => {
    calculatedOrderTotal =
      orderDetails.reduce((acc, detail) => acc + detail.subtotal, 0) +
      shippingCharges;
    return Promise.resolve();
  };

  // Update availableQuantity, calculate subtotal, and create the order
  const processOrderDetails = () => {
    const updateProduct = (detail) => {
      return Product.findByPk(detail.prodId).then((product) => {
        if (!product) {
          throw { status: 400, message: "Invalid product." };
        }
        // Update availableQuantity in the products table
        product.availableQuantity -= detail.quantity;
        // Calculate subtotal based on the product's price
        detail.subtotal = product.price * detail.quantity;
        return product.save();
      });
    };

    const updateProductsPromises = orderDetails.map(updateProduct);
    return Promise.all(updateProductsPromises);
  };

  // Create the order
  const createOrder = () => {
    return Orders.create({
      customerID,
      riderId,
      ownerId,
      shippingCharges,
      orderTotal: calculatedOrderTotal,
      orderStatus,
      isPrescription,
      orderDetails,
    });
  };

  // Handle the entire process using .then and .catch notation
  validateQuantity()
    .then(calculateOrderTotal)
    .then(processOrderDetails)
    .then(createOrder)
    .then((newOrder) => {
      res.status(201).json(newOrder);
    })
    .catch((error) => {
      console.error("Error placing order:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const viewProfile = (req, res) => {
  const { email } = req.params;
  // Retrieve customer record from the 'customers' table
  Customers.findOne({
    where: { email: email },
    attributes: { exclude: ["id"] },
  })
    .then((customerRecord) => {
      if (!customerRecord) {
        return res
          .status(404)
          .json({ error: "Customer not found with this email." });
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
              .json({ error: "customer not found with this email." });
          }

          // Combine and send the response
          const combinedResponse = {
            customer: customerRecord.toJSON(),
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
      console.error("Error retrieving customer record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
const viewPrescriptions = (req, res) => {
  const { email } = req.params;

  Prescription.findAll({
    where: {
      customerEmail: email,
    },
  })
    .then((prescriptions) => {
      if (prescriptions.length == 0)
        throw {
          status: 400,
          message: "No Prescriptions exist against this user",
        };
      else res.status(200).json(prescriptions);
    })
    .catch((error) => {
      console.error("Error creating customer:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};

const viewOrders = (req, res) => {
  const { id } = req.params;

  Orders.findAll({
    where: {
      customerID: id,
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
const getNearbyStoresForCustomers = async (req, res) => {
  const { email } = req.params;
  try {
    // Get the user's address based on the provided email
    const user = await USER.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const addressComponents = user.address.split(",");
    if (addressComponents.length !== 2) {
      return res.status(400).json({ error: "Invalid address format" });
    }

    const [lng, lat] = addressComponents.map((coord) =>
      parseFloat(coord.trim())
    );

    // Use raw SQL to find IDs of all riders nearby the user's address
    const nearbyRiders = await USER.findAll({
      attributes: ["email"],
      where: literal(`
        ${lat} IS NOT NULL AND ${lng} IS NOT NULL AND
        role = 'Rider' AND
        6371 * acos(
          cos(radians(${lat})) * cos(radians(SPLIT_PART(address, ',', 2)::float8)) *
          cos(radians(SPLIT_PART(address, ',', 1)::float8) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(SPLIT_PART(address, ',', 2)::float8))
        )  <= 3
      `),
      include: [],
    });
    const riderEmails = nearbyRiders.map((rider) => rider.email);
    
    // Retrieve working areas of those riders from the Riders table
    const workingAreas = await Rider.findAll({
      attributes: ["workingArea",'email'],
      where: literal(` 
      "availabilityStatus"='Online' AND
      email IN (${riderEmails.map((email) => `'${email}'`).join(",")})
      `),
    });
    if(workingAreas.length<1)
    return res.status(200).json({ success:false });
    const responseEmails = workingAreas.map((rider) => rider.email);
    const response = workingAreas.map((rider) => rider.workingArea);
    // Include a subquery to check for stores with at least one product in the products table
    const storeConditions = response
      .map((area) => {
        const [areaLng, areaLat] = area
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        return `
        6371 * acos(
          cos(radians(${areaLat})) * cos(radians(SPLIT_PART(store_address, ',', 2)::float8)) *
          cos(radians(SPLIT_PART(store_address, ',', 1)::float8) - radians(${areaLng})) +
          sin(radians(${areaLat})) * sin(radians(SPLIT_PART(store_address, ',', 2)::float8))) <= 3
      `;
      })
      .join(` OR `);

    const stores = await Store.findAll({
      // Add any additional attributes you need
      where: literal(
        `availability='Online' AND
        ${storeConditions}`
        ),
    });
    const storesWithProducts = await Promise.all(
      stores.map(async (store) => {
        const products = await Product.findOne({
          where: {
            storeId: store.storeID,
          },
          limit: 1, // Fetch only one product per store
        });
        if (products) {
          return { ...store.toJSON() }; // Include all store attributes
        }

        return null; // Exclude stores without products
      })
    );

    // Filter out null values (stores without products)
    const filteredStores = storesWithProducts.filter((store) => store !== null);

    return res.status(200).json({ stores: filteredStores, success:true, riders:riderEmails });
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching nearby stores" ,success:false});
  }
};
module.exports = {
  getNearbyStoresForCustomers,
  createCustomer,
  createPrescription,
  placeOrder,
  viewProfile,
  viewPrescriptions,
  viewOrders,
};
