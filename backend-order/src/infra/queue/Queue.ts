import amqp from "amqplib";
import { inject } from "../di/Registry";
import DatabaseConnection from "../database/DatabaseConnection";

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
        this.channel.prefetch(1);
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

export class RabbitMQOutboxAdapter implements Queue {
    @inject("databaseConnection")
    databaseConnection!: DatabaseConnection;
    connection!: amqp.ChannelModel;
    channel!: amqp.Channel;

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
        this.channel.prefetch(1);
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
        const messageId = crypto.randomUUID();
        await this.databaseConnection.query("insert into ccca.message (message_id, event, data, status, timestamp) values ($1, $2, $3, $4, $5)", [messageId, event, data, "pending", new Date()]);
    }

    async setup(exchange: string, queue: string): Promise<void> {
        await this.channel.assertExchange(exchange, "direct", { durable: true });
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, exchange, "");
    }

}
