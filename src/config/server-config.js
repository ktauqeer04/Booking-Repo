const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    DEV_URL: process.env.FLIGHT_SERVICE_DEV_URL
}