import amqp from "amqplib";

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.consume("orderPlaced.executeOrder", (message: any) => {
        console.log(message.content.toString());
        channel.ack(message);
    });
}

main();