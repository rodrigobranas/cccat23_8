import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import Registry from "./infra/di/Registry";

async function main () {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().register("httpServer", httpServer);
    Registry.getInstance().register("databaseConnection", new PgPromiseAdapter()); 
    Registry.getInstance().register("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().register("signup", new Signup());
    Registry.getInstance().register("getAccount", new GetAccount());
    new AccountController();
    httpServer.listen(3002);
}

main();