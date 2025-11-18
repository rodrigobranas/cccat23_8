import Book from "../src/domain/Book";
import Order from "../src/domain/Order";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve testar o livro de ofertas A", async () => {
    const marketId = "BTC-USD";
    const book = new Book(marketId);
    const events: Order[] = [];
    book.register("orderFilled", async (data: Order) => {
        events.push(data);
    });
    const accountId = crypto.randomUUID();
    const order1 = Order.create(accountId, marketId, "buy", 1, 85000);
    const order2 = Order.create(accountId, marketId, "sell", 1, 85000);
    await book.insert(order1);
    expect(order1.getFillQuantity()).toBe(0);
    expect(order1.getStatus()).toBe("open");
    await book.insert(order2);
    expect(order1.getFillQuantity()).toBe(1);
    expect(order1.getStatus()).toBe("closed");
    expect(order2.getFillQuantity()).toBe(1);
    expect(order2.getStatus()).toBe("closed");
    expect(events).toHaveLength(2);
});

test("Deve testar o livro de ofertas B", async () => {
    const marketId = "BTC-USD";
    const book = new Book(marketId);
    const events: Order[] = [];
    book.register("orderFilled", async (data: Order) => {
        events.push(data);
    });
    const accountId = crypto.randomUUID();
    const order1 = Order.create(accountId, marketId, "sell", 1, 82000);
    await book.insert(order1);
    await sleep(10);
    const order2 = Order.create(accountId, marketId, "sell", 1, 84000);
    await book.insert(order2);
    await sleep(10);
    const order3 = Order.create(accountId, marketId, "sell", 2, 80000);
    await book.insert(order3);
    await sleep(10);
    const order4 = Order.create(accountId, marketId, "buy", 4, 85000);
    await book.insert(order4);
    await sleep(10);
    expect(order1.getStatus()).toBe("closed");
    expect(order2.getStatus()).toBe("closed");
    expect(order3.getStatus()).toBe("closed");
    expect(order4.getStatus()).toBe("closed");
    console.log(order4);
});
