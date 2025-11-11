import Book from "../src/domain/Book";
import Order from "../src/domain/Order";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

test("Deve testar o livro de ofertas", async () => {
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
    expect(events[0].getFillPrice()).toBe(85000);
    expect(events[1].getFillPrice()).toBe(85000);
});
