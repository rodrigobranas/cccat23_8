import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class ExecuteOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (marketId: string): Promise<void> {
        const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(marketId, "open");
        const highestBuy = orders.filter((order: Order) => order.side === "buy").sort((a: Order, b: Order) => b.price - a.price)[0];
        const lowestSell = orders.filter((order: Order) => order.side === "sell").sort((a: Order, b: Order) => a.price - b.price)[0];
        if (highestBuy && lowestSell && highestBuy.price >= lowestSell.price) {
            const fillQuantity = Math.min(highestBuy.getAvailableQuantity(), lowestSell.getAvailableQuantity());
            const fillPrice = (highestBuy.timestamp.getTime() > lowestSell.timestamp.getTime()) ? lowestSell.price : highestBuy.price;
            highestBuy.fill(fillQuantity, fillPrice);
            lowestSell.fill(fillQuantity, fillPrice);
            await this.orderRepository.updateOrder(highestBuy);
            await this.orderRepository.updateOrder(lowestSell);
        }
    }

}
