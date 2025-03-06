import { connect } from "amqplib";

export class RabbitMQClient {

  constructor(exchangeName, bindingKey, data) {
    this.exchangeName = exchangeName;
    this.bindingKey = bindingKey;
    this.data = data;
  }

  async initialize() {
    this.connection = await connect(
        'amqp://localhost'
    );
    this.channel = await this.connection.createChannel();
    this.exchange = await this.channel.assertExchange(
      this.exchangeName,
      "direct",
      {
        durable: false,
      }
    );
  }

  async publish() {
    console.log("Publishing message!");
    this.channel.publish(
      this.exchangeName,
      this.bindingKey,
      Buffer.from(JSON.stringify(this.data))
    );
  }

}

export default RabbitMQClient;
