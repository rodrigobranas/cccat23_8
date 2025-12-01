import Signup from "../src/application/usecase/Signup";
import GetAccount from "../src/application/usecase/GetAccount";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Registry from "../src/infra/di/Registry";
import { AccountDAODatabase } from "../src/infra/dao/AccountDAO";

let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().register("databaseConnection", connection);
    Registry.getInstance().register("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().register("accountDAO", new AccountDAODatabase());
    signup = new Signup();
    getAccount = new GetAccount();
});

test("Deve criar uma conta", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.document).toBe(input.document);
    expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
    await connection.close();
});

// test("Deve criar uma conta com stub", async () => {
//     const input = {
//         name: "John Doe",
//         email: "john.doe@gmail.com",
//         document: "97456321558",
//         password: "asdQWE123"
//     }
//     const saveStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
//     const getStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(Object.assign(input, { accountId: crypto.randomUUID() }));
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.accountId).toBeDefined();
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.document).toBe(input.document);
//     expect(outputGetAccount.password).toBe(input.password);
//     saveStub.restore();
//     getStub.restore();
// });

// test("Deve criar uma conta com spy", async () => {
//     const input = {
//         name: "John Doe",
//         email: "john.doe@gmail.com",
//         document: "97456321558",
//         password: "asdQWE123"
//     }
//     const saveSpy = sinon.spy(AccountDAODatabase.prototype, "saveAccount");
//     const getSpy = sinon.spy(AccountDAODatabase.prototype, "getAccountById");
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.document).toBe(input.document);
//     expect(outputGetAccount.password).toBe(input.password);
//     expect(saveSpy.calledOnce).toBe(true);
//     expect(getSpy.calledOnce).toBe(true);
//     expect(getSpy.calledWith(outputSignup.accountId)).toBe(true);
//     saveSpy.restore();
//     getSpy.restore();
// });

// test("Deve criar uma conta com mock", async () => {
//     const input = {
//         name: "John Doe",
//         email: "john.doe@gmail.com",
//         document: "97456321558",
//         password: "asdQWE123"
//     }
//     const mock = sinon.mock(AccountDAODatabase.prototype);
//     mock.expects("saveAccount").once().resolves();
//     mock.expects("getAccountById").once().resolves(input);
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.document).toBe(input.document);
//     expect(outputGetAccount.password).toBe(input.password);
//     mock.verify();
//     mock.restore();
// });

// test("Deve criar uma conta com fake", async () => {
//     const accountDAO = new AccountDAOMemory();
//     const accountAssetDAO = new AccountAssetDAODatabase();
//     const getAccount = new GetAccount(accountDAO, accountAssetDAO);
//     const input = {
//         name: "John Doe",
//         email: "john.doe@gmail.com",
//         document: "97456321558",
//         password: "asdQWE123"
//     }
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.document).toBe(input.document);
//     expect(outputGetAccount.password).toBe(input.password);
// });
