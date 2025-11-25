import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";
import BookController from "./infra/controller/BookController";
import Book from "./domain/Book";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import BookCache from "./infra/cache/BookCache";

async function main () {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("books", new BookCache());
    new BookController();
    httpServer.listen(3001);
}

main();
