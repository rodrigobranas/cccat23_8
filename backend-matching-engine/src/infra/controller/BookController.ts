import Book from "../../domain/Book";
import Order from "../../domain/Order";
import BookCache from "../cache/BookCache";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";
import Queue from "../queue/Queue";

export default class BookController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("queue")
    queue!: Queue;
    @inject("books")
    books!: BookCache;
    
    constructor () {
        this.httpServer.route("post", "/markets/:{marketId}/orders", async (params: any, body: any) => {
            const order = new Order(body.orderId, body.accountId, body.marketId, body.side, body.quantity, body.price, body.status, new Date(body.timestamp), body.fillQuantity, body.fillPrice);
            const book = this.books.getBook(body.marketId);
            await book.insert(order);
        });
        this.queue.consume("orderPlaced.executeOrder", async (body: any) => {
            const order = new Order(body.orderId, body.accountId, body.marketId, body.side, body.quantity, body.price, body.status, new Date(body.timestamp), body.fillQuantity, body.fillPrice);
            const book = this.books.getBook(body.marketId);
            await book.insert(order);
        });
    }

}
