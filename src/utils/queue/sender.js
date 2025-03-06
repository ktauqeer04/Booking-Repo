import RabbitMQClient from "./sender-init.js";

export const connectQueue = async (data) => {
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