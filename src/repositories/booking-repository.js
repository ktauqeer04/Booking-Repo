const crudRespository = require("./crud-repostitory");
const { Booking } = require('../models');

class BookingRepository extends crudRespository{
    constructor(){
        super(Booking);
    }

    // custom booking operations

    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }

}


module.exports = BookingRepository;