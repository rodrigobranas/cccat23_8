import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";
import { WalletRepositoryDatabase } from "./infra/repository/WalletRepository";
import OrderController from "./infra/controller/OrderController";
import { OrderRepositoryDatabase } from "./infra/repository/OrderRepository";
import FillOrder from "./application/usecase/FillOrder";
import Deposit from "./application/usecase/Deposit";
import PlaceOrder from "./application/usecase/PlaceOrder";
import Mediator from "./infra/mediator/Mediator";
import ExecuteOrder from "./application/usecase/ExecuteOrder";
import { BookGatewayHttp } from "./infra/gateway/BookGateway";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.executeOrder");
    await queue.setup("orderFilled", "orderFilled.fillOrder");
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("queue", queue);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("orderRepository", new OrderRepositoryDatabase());
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    Registry.getInstance().register("bookGateway", new BookGatewayHttp());
    Registry.getInstance().register("mediator", new Mediator());
    Registry.getInstance().register("placeOrder", new PlaceOrder());
    Registry.getInstance().register("deposit", new Deposit());
    Registry.getInstance().register("fillOrder", new FillOrder());
    Registry.getInstance().register("executeOrder", new ExecuteOrder());
    new OrderController();
    httpServer.listen(3000);
}

main();
