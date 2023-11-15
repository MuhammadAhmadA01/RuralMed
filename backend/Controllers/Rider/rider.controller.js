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
module.exports = { createRider };
