import amqp from "amqplib";

export default interface Queue {
    connect (): Promise<void>;
    consume (event: string, callback: Function): Promise<void>;
    publish (event: string, data: any): Promise<void>;
    setup (exchange: string, queue: string): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
    connection!: amqp.ChannelModel;
    channel!: amqp.Channel;

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }

    async consume(event: string, callback: Function): Promise<void> {
        await this.channel.consume(event, async (message: any) => {
            try {
                const input = JSON.parse(message.content.toString());
                await callback(input);
                this.channel.ack(message);
            } catch (e: any) {
                console.error(e);
            }
        });
    }

    async publish(event: string, data: any): Promise<void> {
        this.channel.publish(event, "", Buffer.from(JSON.stringify(data)));
    }

    async setup(exchange: string, queue: string): Promise<void> {
        await this.channel.assertExchange(exchange, "direct", { durable: true });
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, exchange, "");
    }

}
