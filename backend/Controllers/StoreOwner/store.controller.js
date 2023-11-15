const  Stores  = require('../../Models/Store/Store');

const createStore = (req, res) => {
  const {
    ownerEmail,
    storeName,
    storeAddress,
    storeContact,
    storeType,
    startTime,
    endTime,
    availability,
  } = req.body;

  Stores.findOne({ where: { ownerEmail } })
    .then(existingStoreEmail => {
      if (existingStoreEmail) {
        throw {status:400, message: 'Email already in use' };
      }

      return Stores.findOne({ where: { storeContact } });
    })
    .then(existingStoreContact => {
      if (existingStoreContact) {
        throw {status:400, message: 'contact already in use' };

      }

      return Stores.create({
        ownerEmail,
        storeName,
        storeAddress,
        storeContact,
        storeType,
        startTime,
        endTime,
        availability,
      });
    })
    .then(newStore => {
      res.status(201).json(newStore);
    })
    .catch(error => {
      console.error('Error creating store:', error);
      const status = error.status || 500;
      res.status(status).json({ error: error.message || 'Internal Server Error' });
    
    });
};

module.exports = { createStore };
