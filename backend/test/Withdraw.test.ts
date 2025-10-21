import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import Deposit from "../src/Deposit";
import Withdraw from "../src/Withdraw";
import { AccountRepositoryDatabase } from "../src/AccountRepository";

let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

beforeEach(() => {
    const accountRepository = new AccountRepositoryDatabase();
    signup = new Signup(accountRepository);
    getAccount = new GetAccount(accountRepository);
    deposit = new Deposit(accountRepository);
    withdraw = new Withdraw(accountRepository);
});

test("Deve fazer um saque", async () => {
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
        quantity: 2
    }
    await deposit.execute(inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 1
    }
    await withdraw.execute(inputWithdraw);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(1);
});

test("Deve fazer um saque", async () => {
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
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 2
    }
    await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(new Error("Insufficient funds"));
});
