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

module.exports = { createOwner };