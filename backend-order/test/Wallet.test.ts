import Wallet from "../src/domain/Wallet";

test("Deve fazer dois depósitos", () => {
    const wallet = Wallet.create(crypto.randomUUID());
    wallet.deposit("BTC", 1);
    wallet.deposit("BTC", 1);
    expect(wallet.getBalance("BTC")).toBe(2);
});

test("Deve fazer um saque", () => {
    const wallet = Wallet.create(crypto.randomUUID());
    wallet.deposit("BTC", 1);
    wallet.withdraw("BTC", 1);
    expect(wallet.getBalance("BTC")).toBe(0);
});

test("Não deve depositar quantidade negativa", () => {
    const wallet = Wallet.create(crypto.randomUUID());
    expect(() => wallet.deposit("BTC", -1)).toThrow(new Error("Quantity must be positive"));
});

test("Não deve sacar quantidade negativa", () => {
    const wallet = Wallet.create(crypto.randomUUID());
    expect(() => wallet.withdraw("BTC", -1)).toThrow(new Error("Quantity must be positive"));
});

test("Não deve sacar se não tiver fundos", () => {
    const wallet = Wallet.create(crypto.randomUUID());
    wallet.deposit("BTC", 1);
    expect(() => wallet.withdraw("BTC", 2)).toThrow(new Error("Insufficient funds"));
});
