import Order from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class PlaceOrder {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute (input: Input): Promise<Output> {
        const account = await this.accountRepository.getAccount(input.accountId);
        const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
        account.processOrder(order);
        await this.orderRepository.saveOrder(order);
        await this.accountRepository.updateAccount(account);
        return {
            orderId: order.getOrderId()
        }
    }

}

type Input = {
    accountId: string,
    marketId: string,
    side: string,
    quantity: number,
    price: number
}

type Output = {
    orderId: string
}