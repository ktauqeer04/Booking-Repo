const RabbitMQClient = require('./sender-init.js');

const connectQueue = async (data) => {
    try {

        console.log("data is", data);

        const Queue = new RabbitMQClient("myExchangeName", "myBindingKey", data);
        await Queue.initialize();
        await Queue.publish();        
    } catch (error) {
        console.log(`error in queue ${error}`);
        throw error;
    }

}

const sendEmail = async (data) => {

    try {

        const Queue = new RabbitMQClient("myExchangeName1", "myBindingKey1", data);
        await Queue.initialize();
        await Queue.publish();

    } catch (error) {

        console.log(`error in queue ${error}`);
        throw error;

    }

}


module.exports = {
    connectQueue, 
    sendEmail
}