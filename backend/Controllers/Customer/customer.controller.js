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

module.exports = { createCustomer, createPrescription, viewOrders };
