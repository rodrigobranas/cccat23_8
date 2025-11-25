import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { sleep } from "./infra/util/sleep";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const databaseConnection = new PgPromiseAdapter();
    while (true) {
        console.log("fetching messages...");
        const messages = await databaseConnection.query("select * from ccca.message where status = 'pending'", []);
        for (const message of messages) {
            queue.publish(message.event, message.data);
            await databaseConnection.query("update ccca.message set status = 'processed' where message_id = $1", [message.message_id]);
        }
        await sleep(1000);
    }
}

main();