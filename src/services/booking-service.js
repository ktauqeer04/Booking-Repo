const axios = require('axios');
const db = require('../models');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const createBooking = async (data) => {

    const transaction = await db.sequelize.transaction();

    try {
        
        const flight = await axios.get(`http://localhost:4000/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats){
            throw new AppError('Flight Seats Unavailable right Now', StatusCodes.BAD_REQUEST);
        }
        await transaction.commit();
        return flightData;

    } catch (error) {
        await transaction.rollback();
        console.log(error);
    }
} 

module.exports = {
    createBooking
}