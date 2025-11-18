import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";
import BookController from "./infra/controller/BookController";
import Book from "./domain/Book";
import Order from "./domain/Order";
import axios from "axios";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    const book = new Book("BTC-USD");
    book.register("orderFilled", async (data: any) => {
        console.log("orderFilled");
        // await axios.post("http://localhost:3000/fill_order", data);
        queue.publish("orderFilled", data);
    });
    Registry.getInstance().register("book", book);
    new BookController();
    httpServer.listen(3001);
}

main();
