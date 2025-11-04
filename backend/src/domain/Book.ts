import Mediator from "../infra/mediator/Mediator";
import Order from "./Order";

export default class Book extends Mediator {
    buys: Order[] = [];
    sells: Order[] = [];

    constructor (readonly marketId: string) {
        super();
    }

    async insert (order: Order) {
        if (order.side === "buy") {
            this.buys.push(order);
            this.buys.sort((a: Order, b: Order) => b.price - a.price);
        }
        if (order.side === "sell") {
            this.sells.push(order);
            this.sells.sort((a: Order, b: Order) => a.price - b.price);
        }
        await this.execute();
    }

    async execute () {
        const highestBuy = this.buys[0];
        const lowestSell = this.sells[0];
        if (highestBuy && lowestSell && highestBuy.price >= lowestSell.price) {
            const fillQuantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
            const fillPrice = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            highestBuy.fill(fillQuantity, fillPrice);
            lowestSell.fill(fillQuantity, fillPrice);
            if (highestBuy.getStatus() === "closed") this.buys.splice(this.buys.indexOf(highestBuy), 1);
            if (lowestSell.getStatus() === "closed") this.sells.splice(this.buys.indexOf(lowestSell), 1);
            await this.notifyAll("orderFilled", highestBuy);
            await this.notifyAll("orderFilled", lowestSell);
        }
    }
}
