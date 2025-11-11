import Deposit from "../src/application/usecase/Deposit";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import Withdraw from "../src/application/usecase/Withdraw";
import Registry from "../src/infra/di/Registry";
import { WalletRepositoryDatabase } from "../src/infra/repository/WalletRepository";
import AccountGateway, { AccountGatewayHttp } from "../src/infra/gateway/AccountGateway";
import GetWallet from "../src/application/usecase/GetWallet";

let accountGateway: AccountGateway;
let getWallet: GetWallet;
let deposit: Deposit;
let withdraw: Withdraw;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", connection);
    Registry.getInstance().register("walletRepository", new WalletRepositoryDatabase());
    accountGateway = new AccountGatewayHttp();
    getWallet = new GetWallet();
    deposit = new Deposit();
    withdraw = new Withdraw();
});

test("Deve fazer um saque", async () => {
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
        quantity: 2
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 1
    }
    await withdraw.execute(inputWithdraw);
    const outputGetWallet = await getWallet.execute(outputSignup.accountId);
    expect(outputGetWallet.assets).toHaveLength(1);
    expect(outputGetWallet.assets[0].assetId).toBe("BTC");
    expect(outputGetWallet.assets[0].quantity).toBe(1);
});

test("Deve fazer um saque", async () => {
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
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 2
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insufficient funds"));
});

afterEach(async () => {
    await connection.close();
});