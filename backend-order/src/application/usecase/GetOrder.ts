import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute (orderId: string): Promise<Output> {
        const order = await this.orderRepository.getOrder(orderId);
        const account = await this.accountGateway.getAccount(order.getAccountId());
        return {
            orderId: order.getOrderId(),
            accountId: order.getAccountId(),
            marketId: order.marketId,
            name: account.name,
            email: account.email,
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
    name: string,
    email: string,
    side: string,
    quantity: number,
    price: number,
    status: string,
    timestamp: Date,
    fillQuantity: number,
    fillPrice: number
}
