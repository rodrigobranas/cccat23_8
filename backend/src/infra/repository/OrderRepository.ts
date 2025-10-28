import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface OrderRepository {
    saveOrder (order: Order): Promise<void>;
    getOrder (orderId: string): Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveOrder(order: Order): Promise<void> {
        await this.connection.query("insert into ccca.order (order_id, account_id, market_id, side, quantity, price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8)", [order.getOrderId(), order.getAccountId(), order.marketId, order.side, order.quantity, order.price, order.status, order.timestamp]);
    }

    async getOrder(orderId: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from ccca.order where order_id = $1", [orderId]);
        if (!orderData) throw new Error("Order not found");
        return new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp);
    }

}
