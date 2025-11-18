import Deposit from "../../application/usecase/Deposit";
import ExecuteOrder from "../../application/usecase/ExecuteOrder";
import FillOrder from "../../application/usecase/FillOrder";
import PlaceOrder from "../../application/usecase/PlaceOrder";
import Order from "../../domain/Order";
import { inject } from "../di/Registry";
import BookGateway from "../gateway/BookGateway";
import HttpServer from "../http/HttpServer";
import Mediator from "../mediator/Mediator";
import Queue from "../queue/Queue";
import OrderRepository from "../repository/OrderRepository";

export default class OrderController {
    @inject("fillOrder")
    fillOrder!: FillOrder;
    @inject("deposit")
    deposit!: Deposit;
    @inject("placeOrder")
    placeOrder!: PlaceOrder;
    @inject("executeOrder")
    executeOrder!: ExecuteOrder;
    @inject("bookGateway")
    bookGateway!: BookGateway;
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("mediator")
    mediator!: Mediator;
    @inject("queue")
    queue!: Queue;

    constructor () {
        this.httpServer.route("post", "/place_order", async (params: any, body: any) => {
            const input = body;
            await this.placeOrder.execute(input);
        });
        this.httpServer.route("post", "/deposit", async (params: any, body: any) => {
            const input = body;
            await this.deposit.execute(input);
        });
        this.httpServer.route("post", "/fill_order", async (params: any, body: any) => {
            const input = body;
            await this.fillOrder.execute(input);
        });
        this.mediator.register("orderPlaced", async (order: Order) => {
            // await this.executeOrder.execute(order.marketId);
            // await this.bookGateway.insertOrder(order);
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
            await this.queue.publish("orderPlaced", body);
        });
        this.queue.consume("orderFilled.fillOrder", async (body: any) => {
            console.log("fillOrder");
            await this.fillOrder.execute(body);
        });
    }

}
