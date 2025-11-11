import { group } from "../../domain/GroupOrders";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetDepth {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (marketId: string): Promise<Output> {
        const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(marketId, "open");
        const buys = group(orders, "buy");
        const sells = group(orders, "sell");
        return {
            marketId,
            buys,
            sells
        }
    }
}

type Output = {
    marketId: string,
    buys: { price: number, quantity: number }[],
    sells: { price: number, quantity: number }[],
}