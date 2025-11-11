import Order from "../../domain/Order";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface OrderRepository {
    saveOrder (order: Order): Promise<void>;
    updateOrder (order: Order): Promise<void>;
    getOrder (orderId: string): Promise<Order>;
    getOrdersByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]>;
}

export class OrderRepositoryDatabase implements OrderRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async saveOrder(order: Order): Promise<void> {
        await this.connection.query("insert into ccca.order (order_id, account_id, market_id, side, quantity, price, status, timestamp, fill_quantity, fill_price) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [order.getOrderId(), order.getAccountId(), order.marketId, order.side, order.quantity, order.price, order.getStatus(), order.timestamp, order.getFillQuantity(), order.getFillPrice()]);
    }

    async updateOrder (order: Order): Promise<void> {
        await this.connection.query("update ccca.order set fill_quantity = $1, fill_price = $2, status = $3 where order_id = $4", [order.getFillQuantity(), order.getFillPrice(), order.getStatus(), order.getOrderId()]);
    }

    async getOrder(orderId: string): Promise<Order> {
        const [orderData] = await this.connection.query("select * from ccca.order where order_id = $1", [orderId]);
        if (!orderData) throw new Error("Order not found");
        return new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp, parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price));
    }

    async getOrdersByMarketIdAndStatus(marketId: string, status: string): Promise<Order[]> {
        const ordersData = await this.connection.query("select * from ccca.order where market_id = $1 and status = $2", [marketId, status]);
        const orders: Order[] = [];
        for (const orderData of ordersData) {
            const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price), orderData.status, orderData.timestamp, parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price));
            orders.push(order);
        }
        return orders;
    }

}
