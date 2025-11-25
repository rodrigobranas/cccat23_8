import OrderDAO from "../../infra/dao/OrderDAO";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";

export default class UpdateOrderProjection {
    @inject("orderDAO")
    orderDAO!: OrderDAO;
    @inject("accountGateway")
    accountGateway!: AccountGateway;

    async execute (input: any): Promise<void> {
        await this.orderDAO.updateOrderProjection(input);
    }
}