const express = require('express');
const BookingRoute = require('./booking-route');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/booking', BookingRoute);

module.exports = router;