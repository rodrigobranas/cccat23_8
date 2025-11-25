import OrderDAO from "../../infra/dao/OrderDAO";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";

export default class CreateOrderProjection {
    @inject("orderDAO")
    orderDAO!: OrderDAO;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute (input: any): Promise<void> {
        const account = await this.accountGateway.getAccount(input.accountId);
        const order = Object.assign(input, account);
        await this.orderDAO.saveOrderProjection(order);
    }
}