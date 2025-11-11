import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Registry from "./infra/di/Registry";
import { WalletRepositoryDatabase } from "./infra/repository/WalletRepository";
import OrderController from "./infra/controller/OrderController";
import { OrderRepositoryDatabase } from "./infra/repository/OrderRepository";
import FillOrder from "./application/usecase/FillOrder";

async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().register("orderRepository", new OrderRepositoryDatabase());
    Registry.getInstance().register("fillOrder", new FillOrder());
    new OrderController();
    httpServer.listen(3000);
}

main();
