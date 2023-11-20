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

module.exports = { createRider,viewProfile };
