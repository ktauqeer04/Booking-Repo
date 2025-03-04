const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

router.post('/', BookingController.getFlight);
router.post('/payments', BookingController.payment);

module.exports = router;