import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import Deposit from "../src/application/usecase/Deposit";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Registry from "../src/infra/di/Registry";
import PlaceOrder from "../src/application/usecase/PlaceOrder";
import GetOrder from "../src/application/usecase/GetOrder";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";

let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let connection: DatabaseConnection;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", connection);
    Registry.getInstance().register("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().register("orderRepository", new OrderRepositoryDatabase());
    signup = new Signup();
    getAccount = new GetAccount();
    deposit = new Deposit();
    placeOrder = new PlaceOrder();
    getOrder = new GetOrder();
});

test("Deve fazer uma ordem de compra", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 100000
    }
    await deposit.execute(inputDeposit);
    const inputPlaceOrder = {
        accountId: outputSignup.accountId,
        marketId: "BTC-USD",
        side: "buy",
        quantity: 1,
        price: 85000
    }
    const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
    expect(outputPlaceOrder.orderId).toBeDefined();
    const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);
    expect(outputGetOrder.marketId).toBe("BTC-USD");
    expect(outputGetOrder.side).toBe("buy");
    expect(outputGetOrder.quantity).toBe(1);
    expect(outputGetOrder.price).toBe(85000);
    expect(outputGetOrder.status).toBe("open");
});

test("Não deve fazer uma ordem de compra sem saldo", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(inputSignup);
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
    const outputSignup = await signup.execute(inputSignup);
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

afterEach(async () => {
    await connection.close();
});
