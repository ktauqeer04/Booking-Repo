const cron = require('node-cron');
const { BookingService } = require('../../services');

const scheduleCrons = () => {
    cron.schedule('*/5 * * * * *', async () => {
        console.log('running task every 5 seconds')
        const response = await BookingService.cancelRecentBookings();
        console.log("response from cron", response);
    });
}


module.exports = scheduleCrons;