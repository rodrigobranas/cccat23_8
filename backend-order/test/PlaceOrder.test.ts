import Deposit from "../src/application/usecase/Deposit";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Registry from "../src/infra/di/Registry";
import PlaceOrder from "../src/application/usecase/PlaceOrder";
import GetOrder from "../src/application/usecase/GetOrder";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";
import { WalletRepositoryDatabase } from "../src/infra/repository/WalletRepository";
import Mediator from "../src/infra/mediator/Mediator";
import ExecuteOrder from "../src/application/usecase/ExecuteOrder";
import Book from "../src/domain/Book";
import GetDepth from "../src/application/usecase/GetDepth";
import AccountGateway, { AccountGatewayHttp } from "../src/infra/gateway/AccountGateway";
import { BookGatewayHttp } from "../src/infra/gateway/BookGateway";

let accountGateway: AccountGateway;
let deposit: Deposit;
let connection: DatabaseConnection;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;
let getDepth: GetDepth;
let marketId: string;

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

beforeEach(() => {
    marketId = `BTC-USD-${Math.random()}`;
    connection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", connection);
    const orderRepository = new OrderRepositoryDatabase();
    Registry.getInstance().register("orderRepository", orderRepository);
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    const book = new Book(marketId);
    book.register("orderFilled", async (data: any) => {
        const order = data;
        await orderRepository.updateOrder(order);
    });
    const mediator = new Mediator();
    const bookGateway = new BookGatewayHttp();
    mediator.register("orderPlaced", async (data: any) => {
        const order = data;
        // await book.insert(order);
        await bookGateway.insertOrder(order);
    });
    Registry.getInstance().register("mediator", mediator);
    accountGateway = new AccountGatewayHttp();
    Registry.getInstance().register("accountGateway", accountGateway);
    deposit = new Deposit();
    placeOrder = new PlaceOrder();
    getOrder = new GetOrder();
    getDepth = new GetDepth();
});

test("Deve fazer uma ordem de compra", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 300000
    }
    await deposit.execute(inputDeposit);
    const outputPlaceOrder = await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 85000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 85000
    });
    await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 83000
    });
    expect(outputPlaceOrder.orderId).toBeDefined();
    const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
    expect(outputGetOrder.marketId).toBe(marketId);
    expect(outputGetOrder.side).toBe("buy");
    expect(outputGetOrder.quantity).toBe(1);
    expect(outputGetOrder.price).toBe(85000);
    expect(outputGetOrder.status).toBe("open");
    const outputGetDepth = await getDepth.execute(marketId);
    expect(outputGetDepth.buys).toHaveLength(2);
    expect(outputGetDepth.sells).toHaveLength(0);
});

test("Não deve fazer uma ordem de compra sem saldo", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 50000
    }
    await deposit.execute(inputDeposit);
    const inputPlaceOrder = {
        accountId: outputSignup.accountId,
        marketId: "BTC-USD",
        side: "buy",
        quantity: 1,
        price: 85000
    }
    await expect(() => placeOrder.execute(inputPlaceOrder)).rejects.toThrow(new Error("Insufficient funds"));
});

test("Não deve fazer uma ordem de venda sem saldo", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountGateway.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 1
    }
    await deposit.execute(inputDeposit);
    const inputPlaceOrder = {
        accountId: outputSignup.accountId,
        marketId: "BTC-USD",
        side: "sell",
        quantity: 2,
        price: 85000
    }
    await expect(() => placeOrder.execute(inputPlaceOrder)).rejects.toThrow(new Error("Insufficient funds"));
});

test("Deve fazer uma ordem de compra e uma ordem de venda A", async () => {
    const marketId = `BTC-USD-${Math.random()}`;
    const outputSignup = await accountGateway.signup({
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    });
    await deposit.execute({
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100000
    });
    await deposit.execute({
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 1
    });
    const outputPlaceOrder1 = await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 85000
    });
    await sleep(200);
    const outputPlaceOrder2 = await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 83000
    });
    await sleep(200);
    const outputGetOrder1 = await getOrder.execute(outputPlaceOrder1.orderId);
    const outputGetOrder2 = await getOrder.execute(outputPlaceOrder2.orderId);
    expect(outputGetOrder1.fillQuantity).toBe(1);
    expect(outputGetOrder1.fillPrice).toBe(85000);
    expect(outputGetOrder1.status).toBe("closed");
    expect(outputGetOrder2.fillQuantity).toBe(1);
    expect(outputGetOrder2.fillPrice).toBe(85000);
    expect(outputGetOrder2.status).toBe("closed");
});

test("Deve fazer uma ordem de venda e uma ordem de compra B", async () => {
    const outputSignup = await accountGateway.signup({
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    });
    await deposit.execute({
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100000
    });
    await deposit.execute({
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 1
    });
    const outputPlaceOrder1 = await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 85000
    });
    await sleep(200);
    const outputPlaceOrder2 = await placeOrder.execute({
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 88000
    });
    await sleep(200);
    const outputGetOrder1 = await getOrder.execute(outputPlaceOrder1.orderId);
    await sleep(200);
    const outputGetOrder2 = await getOrder.execute(outputPlaceOrder2.orderId);
    expect(outputGetOrder1.fillQuantity).toBe(1);
    expect(outputGetOrder1.fillPrice).toBe(85000);
    expect(outputGetOrder1.status).toBe("closed");
    expect(outputGetOrder2.fillQuantity).toBe(1);
    expect(outputGetOrder2.fillPrice).toBe(85000);
    expect(outputGetOrder2.status).toBe("closed");
});

afterEach(async () => {
    await connection.close();
});
