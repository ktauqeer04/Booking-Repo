const axios = require('axios');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const BookingRepository = require('../repositories/booking-repository');
const { enums } = require('../utils/common');
const { BOOKED } = enums.BOOKING_STATUS;
const { DEV_URL } = require('../config/server-config');
const { StatusCodes } = require('http-status-codes');

const bookingRespository = new BookingRepository();
 

const createBooking = async (data) => {

    const transaction = await db.sequelize.transaction();

    try {
        
        const flight = await axios.get(`${DEV_URL}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('Flight Seats Unavailable right Now', StatusCodes.BAD_REQUEST);
        }

        const totalBill = data.noOfSeats * flightData.price;

        console.log(data)

        const payload = {
            ...data,
            totalCost: totalBill
        }


        const booking = await bookingRespository.createBooking(payload, transaction);

        console.log(data.flightId);


        await axios.patch(`${DEV_URL}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats,
            decrease: true
        })

        await transaction.commit();
        return flightData;

    } catch (error) {

        await transaction.rollback();
        throw error;

    }
} 


const makePayment = async (data) => {

    const transaction = await db.sequelize.transaction();

    try {
        
             bookingDetails = await bookingRespository.get(data.bookingId, transaction);
        if(data.userId != bookingDetails.userId) {
            throw new AppError('Wrong userId', StatusCodes.UNAUTHORIZED);
        }

        if(data.price != bookingDetails.totalCost){
            throw new AppError('Payment Not Sufficient', StatusCodes.BAD_REQUEST);
        }

        const bookingUpdate = await bookingRespository.update(data.bookingId, {status: BOOKED}, transaction);

        await transaction.commit();

    } catch (error) {

        await transaction.rollback();
        throw error;

    }
}


module.exports = {
    createBooking,
    makePayment
}