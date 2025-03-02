const { StatusCodes } = require("http-status-codes");
const { SuccessResponse } = require("../../../Flight-service/src/utils/common");
const { createBooking } = require("../services/booking-service");

const getFlight = async (req, res) => {

    try {
        const { flightId, noOfSeats } = req.body;
        const flightDetails = createBooking({ flightId, noOfSeats });
        SuccessResponse.data = flightDetails;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        SuccessResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(SuccessResponse);
    }

}

module.exports = {
    getFlight   
}