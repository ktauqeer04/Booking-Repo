const crudRespository = require("./crud-repostitory");
const { Booking } = require('../models');

class BookingRepository extends crudRespository{
    constructor(){
        super(Booking);
    }

    // custom booking operations

}


module.exports = BookingRepository;