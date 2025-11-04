import Order from "./Order";

export function group (orders: Order[], side: string) {
    let index: { [price: number]: { quantity: number, price: number }} = {};
    for (const order of orders) {
        if (order.side === side) {
            index[order.price] = index[order.price] || { quantity: 0, price: order.price };
            index[order.price].quantity += order.quantity;
        }
    }
    return Object.values(index).sort((a, b) => a.price - b.price);
}
