import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import Deposit from "../src/application/usecase/Deposit";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Registry from "../src/infra/di/Registry";

let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", connection);
    Registry.getInstance().register("accountRepository", new AccountRepositoryDatabase());
    signup = new Signup();
    getAccount = new GetAccount();
    deposit = new Deposit();
});

test("Deve fazer um depósito", async () => {
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
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(1);
});

test("Deve fazer dois depósitos do mesmo asset", async () => {
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
    await deposit.execute(inputDeposit);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(2);
});

afterEach(async () => {
    await connection.close();
});
