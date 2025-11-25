import Book from "../../domain/Book";
import { inject } from "../di/Registry";
import Queue from "../queue/Queue";

export default class BookCache {
    @inject("queue")
    queue!: Queue;

    books: { [marketId: string]: Book } = {};

    getBook (marketId: string) {
        if (!this.books[marketId]) {
            const book = new Book(marketId);
            book.register("orderFilled", async (data: any) => {
                console.log("orderFilled");
                this.queue.publish("orderFilled", data);
            });
            this.books[marketId] = book;
        }
        return this.books[marketId];
    }
}