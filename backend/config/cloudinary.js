const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dvb3iz47x', 
  api_key: '481949529656839', 
  api_secret: 'gYfnncjlchwZl5dAabJR1jD4wNA' 
});
module.exports = cloudinary;