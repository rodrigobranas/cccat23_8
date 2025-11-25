import OrderDAO from "../../infra/dao/OrderDAO";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";

export default class GetOrders {
    @inject("orderDAO")
    orderDAO!: OrderDAO;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute (orderId: string): Promise<Output[]> {
        const orders = await this.orderDAO.getOrders();
        const outputs = [];
        for (const order of orders) {
            const output = {
                orderId: order.order_id,
                accountId: order.account_id,
                marketId: order.marketId,
                name: order.name,
                email: order.email,
                side: order.side,
                quantity: order.quantity,
                price: order.price,
                status: order.status,
                timestamp: order.timestamp,
                fillQuantity: order.fill_quantity,
                fillPrice: order.fill_price
            }
            outputs.push(output);
        }
        return outputs;
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
