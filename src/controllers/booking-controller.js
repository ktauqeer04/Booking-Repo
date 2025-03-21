const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../../../Flight-service/src/utils/common");
const { createBooking, makePayment } = require("../services/booking-service");

const getFlight = async (req, res) => {

    try {

        const { flightId, noOfSeats, userId } = req.body;
        const flightDetails = await createBooking({ flightId, noOfSeats, userId });

        console.log(flightDetails);
        
        SuccessResponse.data = flightDetails;
        
        return res.status(StatusCodes.OK).json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

}


const payment = async (req, res) => {

    
    try {

        const { price, bookingId, userId } = req.body;

        console.log({price, bookingId, userId});

        const paymentDetails = await makePayment({ price, bookingId, userId });

        // console.log(paymentDetails);
        
        SuccessResponse.data = paymentDetails;
        
        return res.status(StatusCodes.OK).json(SuccessResponse);

    } catch (error) {
        ErrorResponse.error = error;
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }

}


module.exports = {
    getFlight,
    payment
}