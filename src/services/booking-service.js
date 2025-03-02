const db = require('../models');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');

const createBooking = async (data) => {
    return new Promise((resolve, reject) => {
        db.sequelize.transaction(async function bookingImplementation() {
            const flight = await axios.get(`http://localhost:4000/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;
            if(data.noOfSeats > flightData.totalSeats){
                return reject(new AppError('Flight Seats Unavailable right Now', StatusCodes.BAD_REQUEST));
            }
            return resolve(flightData);
        })
    })
} 

module.exports = {
    createBooking
}