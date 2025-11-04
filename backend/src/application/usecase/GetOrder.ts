import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (orderId: string): Promise<Output> {
        const order = await this.orderRepository.getOrder(orderId);
        return {
            orderId: order.getOrderId(),
            accountId: order.getAccountId(),
            marketId: order.marketId,
            side: order.side,
            quantity: order.quantity,
            price: order.price,
            status: order.getStatus(),
            timestamp: order.timestamp,
            fillQuantity: order.getFillQuantity(),
            fillPrice: order.getFillPrice()
        }
    }

}

type Output = {
    orderId: string,
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number,
    status: string,
    timestamp: Date,
    fillQuantity: number,
    fillPrice: number
}
