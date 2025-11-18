import amqp from "amqplib";

export function sleep (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function main () {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("test", "direct", { durable: true });
    await channel.assertQueue("test.a", { durable: true });
    await channel.assertQueue("test.b", { durable: true });
    await channel.bindQueue("test.a", "test", "");
    await channel.bindQueue("test.b", "test", "");
    let index = 0;
    while (true) {
        const input = {
            orderId: index++
        }
        channel.publish("test", "", Buffer.from(JSON.stringify(input)));
        await sleep(500);
    }
    
}

main();