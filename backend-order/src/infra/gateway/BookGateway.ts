import Order from "../../domain/Order";
import axios from "axios";

axios.defaults.validateStatus = () => true;

export default interface BookGateway {
    insertOrder (order: Order): Promise<void>;
}

export class BookGatewayHttp implements BookGateway {
    
    async insertOrder(order: Order): Promise<void> {
        const body = {
            orderId: order.getOrderId(),
            accountId: order.getAccountId(),
            marketId: order.marketId,
            side: order.side,
            quantity: order.quantity,
            price: order.price,
            fillQuantity: order.getFillQuantity(),
            fillPrice: order.getFillPrice(),
            status: order.getStatus(),
            timestamp: order.timestamp
        }
        await axios.post(`http://localhost:3001/markets/${order.marketId}/orders`, body);
    }

}
