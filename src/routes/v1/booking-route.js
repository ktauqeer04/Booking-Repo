const express = require('express');
const { BookingController } = require('../../controllers');

const router = express.Router();

router.post('/', BookingController);

module.exports = router;