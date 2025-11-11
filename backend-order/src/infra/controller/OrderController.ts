import FillOrder from "../../application/usecase/FillOrder";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";
import OrderRepository from "../repository/OrderRepository";

export default class OrderController {
    @inject("fillOrder")
    fillOrder!: FillOrder;
    @inject("httpServer")
    httpServer!: HttpServer;

    constructor () {
        this.httpServer.route("post", "/fill_order", async (params: any, body: any) => {
            const input = body;
            await this.fillOrder.execute(input);
        });
    }

}
