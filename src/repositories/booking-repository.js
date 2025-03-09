const crudRespository = require("./crud-repostitory");
const AppError = require("../utils/errors/app-error");
const { Booking } = require('../models');
const { StatusCodes } = require("http-status-codes");
const { Op } = require('sequelize');
const { enums } = require('../utils/common');
const { BOOKED, CANCELLED} = enums.BOOKING_STATUS;

class BookingRepository extends crudRespository{
    constructor(){
        super(Booking);
    }

    // custom booking operations

    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }


    async get(data, transaction){

        console.log(`data is`, data);
        

        const response = await Booking.findByPk(data, {transaction: transaction});

        // console.log("response is", response);
        

        if(!response){
            throw new AppError('Not able to find the booking', StatusCodes.NOT_FOUND);
        }

        return response;

    }

    async updateWithTransaction(id, data, transaction){
            
        const response = await Booking.update(data, {
            where:{
                id: id
            }
        }, {
            transaction: transaction
        });

                
        // there is an error here
        // if(!response)    doesn't works but   if(response == 0) works
        if(response == 0){
            // console.log(`the thread reaches here`);
            throw new AppError('Airplane does not exist', StatusCodes.NOT_FOUND);
        }
        
        return response;
    }


    async cancelOldBookings(time){
        const response = await Booking.update({
            status: CANCELLED
        },{
            where:{
                [Op.and]:[
                    {
                        createdAt: {
                            [Op.lt]: time
                        }
                    },
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status:{
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
            }
        })
        
        return response;
    }

}


module.exports = BookingRepository;