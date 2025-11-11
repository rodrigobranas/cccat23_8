import Book from "../../domain/Book";
import Order from "../../domain/Order";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class BookController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("book")
    book!: Book;
    
    constructor () {
        this.httpServer.route("post", "/markets/:{marketId}/orders", async (params: any, body: any) => {
            const order = new Order(body.orderId, body.accountId, body.marketId, body.side, body.quantity, body.price, body.status, new Date(body.timestamp), body.fillQuantity, body.fillPrice);
            await this.book.insert(order);
        });
    }

}
