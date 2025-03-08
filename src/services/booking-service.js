const axios = require('axios');
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const BookingRepository = require('../repositories/booking-repository');
const { enums } = require('../utils/common');
const { BOOKED, CANCELLED} = enums.BOOKING_STATUS;
const { DEV_URL } = require('../config/server-config');
const { StatusCodes } = require('http-status-codes');
const { connectQueue } = require('../utils/queue/sender');


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

        // send data through queue

        const anotherPayload = {
            flightId: data.flightId,
            seats: data.noOfSeats,
            decrease: true
        }

        await connectQueue(anotherPayload);


        // await axios.patch(`${DEV_URL}/api/v1/flights/${data.flightId}/seats`, {
        //     seats: data.noOfSeats,
        //     decrease: true
        // })

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

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();

        if(currentTime - bookingTime > 60000){
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has Expired', StatusCodes.BAD_REQUEST);
        }

        if(data.userId != bookingDetails.userId) {
            throw new AppError('Wrong userId', StatusCodes.UNAUTHORIZED);
        }

        if(data.price != bookingDetails.totalCost){
            throw new AppError('Payment Not Sufficient', StatusCodes.BAD_REQUEST);
        }

        await bookingRespository.update(data.bookingId, {status: BOOKED}, transaction);

        await transaction.commit();

    } catch (error) {

        await transaction.rollback();
        throw error;

    }

}


const cancelBooking = async (bookingID) => {

    const transaction = await db.sequelize.transaction();

    try {
        
        console.log("bookingID is", bookingID);
        
        const bookingDetails = await bookingRespository.get(bookingID, transaction);
        console.log( "booking details are -------> " ,bookingDetails);
        if(bookingDetails.status == CANCELLED || bookingDetails.status == BOOKED){
            await transaction.rollback();
            return true;
        } 


        // await axios.patch(`${DEV_URL}/api/v1/flights/${bookingDetails.flightId}/seats`, {
        //     seats: bookingDetails.noOfSeats,
        //     decrease: false
        // });

        const anotherPayload = {
            flightId: bookingDetails.flightId,
            seats: bookingDetails.noOfSeats,
            decrease: false
        }
        
        await connectQueue(anotherPayload);

        await bookingRespository.updateWithTransaction(bookingID, {status: CANCELLED}, transaction);
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