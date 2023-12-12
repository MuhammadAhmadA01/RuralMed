const Stores = require("../../Models/Store/Store");
const Product = require("../../Models/Product/products");
const createStore = (req, res) => {
  const {
    ownerEmail,
    storeName,
    store_address,
    storeContact,
    storeType,
    startTime,
    endTime,
    availability,
  } = req.body;
  const startTimeDate = new Date(`2000-01-01T${startTime}`);
  const endTimeDate = new Date(`2000-01-01T${endTime}`);

  Stores.findOne({ where: { storeContact } })
    .then((existingStoreContact) => {
      if (existingStoreContact) {
        throw { status: 400, message: "contact already in use" };
      }
      return Stores.create({
        ownerEmail,
        storeName,
        store_address,
        storeContact,
        storeType,
        startTime: startTimeDate.toTimeString().split(" ")[0], // Convert to TIME type
        endTime: endTimeDate.toTimeString().split(" ")[0],
        availability,
      });
    })
    .then((newStore) => {
      res.status(201).json({ newStore, success: true });
    })
    .catch((error) => {
      console.error("Error creating store:", error);
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
};
const getProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const products = await Product.findAll({
      where: { storeId: storeId },
    });

    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("Internal Server Error");
  }
};
const getStoreById = async (req, res) => {
  try {
    const { storeID } = req.params;

    // Find the store by storeID
    const store = await Stores.findOne({
      where: { storeID: storeID },
    });

    if (!store) {
      return res.status(404).json({ error: "Store not found", success: false });
    }
    // Return the store details
    res.status(200).json({ store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

module.exports = { createStore, getProducts, getStoreById };
