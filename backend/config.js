require('dotenv').config();

const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGODB_URL;

module.exports = {
  PORT,
  mongoDBURL
};
