const Customers = require("../../Models/Customer/Customer");
const prescription = require("../../Models/Prescription/prescription");
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
      res.status(201).json(newCustomer);
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
module.exports = {
  createCustomer,
  createPrescription,
  viewOrders,
  viewProfile,
  viewPrescriptions,
  placeOrder
};
