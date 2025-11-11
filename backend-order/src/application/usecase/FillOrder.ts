import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class FillOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (input: Input): Promise<void> {
        const order = await this.orderRepository.getOrder(input.orderId);
        order.fill(input.quantity, input.price);
        await this.orderRepository.updateOrder(order);
    }
}

type Input = {
    orderId: string,
    quantity: number,
    price: number
}
