const  Owners  = require('../../Models/Owner/Owner');

const createOwner = (req, res) => {
  const { cnic, email } = req.body;

  Owners.findOne({ where: { cnic } })
    .then(existingOwnerCnic => {
      if (existingOwnerCnic) {

        throw {status:400, message: 'CNIC is already in use' };
    }

      // If CNIC is unique, check for existing email
      return Owners.findOne({ where: { email } })
        .then(existingOwnerEmail => {
          if (existingOwnerEmail) {
        throw {status:400, message: 'email is already in use' };
        }

          // If both CNIC and email are unique, create a new owner
          return Owners.create({
            cnic,
            email,
          });
        });
    })
    .then(newOwner => {
      res.status(201).json(newOwner);
    })
    .catch(error => {
        console.error('Error creating owner:', error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message || 'Internal Server Error' });
       
    });
};
const addProduct = (req, res) => {
  const { storeId, name, price, description, availableQuantity } = req.body;

  // Check if the specified storeId exists in the stores table
  Store.findByPk(storeId)
    .then((existingStore) => {
      if (!existingStore) {
        throw { status: 400, message: "email is already in use" };
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
const viewOrders = (req, res) => {
  const { id } = req.params;

  Orders.findAll({
    where: {
      storeId: id,
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

module.exports = { createOwner,addProduct,viewOrders };