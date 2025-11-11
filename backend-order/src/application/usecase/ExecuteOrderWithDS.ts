import { match } from "../../domain/OrderMatchService";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class ExecuteOrderWithDS {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (marketId: string): Promise<void> {
        const orders = await this.orderRepository.getOrdersByMarketIdAndStatus(marketId, "open");
        const outputMatch = match(orders);
        if (outputMatch) {
            await this.orderRepository.updateOrder(outputMatch.highestBuy);
            await this.orderRepository.updateOrder(outputMatch.lowestSell);
        }
    }

}
