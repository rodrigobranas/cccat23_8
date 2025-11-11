import Order from "./Order";

export function match (orders: Order[]): Output | undefined {
    const highestBuy = orders.filter((order: Order) => order.side === "buy").sort((a: Order, b: Order) => b.price - a.price)[0];
    const lowestSell = orders.filter((order: Order) => order.side === "sell").sort((a: Order, b: Order) => a.price - b.price)[0];
    if (highestBuy && lowestSell && highestBuy.price >= lowestSell.price) {
        const fillQuantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
        const fillPrice = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
        highestBuy.fill(fillQuantity, fillPrice);
        lowestSell.fill(fillQuantity, fillPrice);
        return { highestBuy, lowestSell };
    }
}

type Output = {
    highestBuy: Order,
    lowestSell: Order
}