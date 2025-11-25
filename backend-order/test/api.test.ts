import axios from "axios";

test("Deve fazer uma ordem", async () => {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3002/signup", input);
    const outputSignup = responseSignup.data;
    const marketId = `BTC-USD`;
    await axios.post("http://localhost:3000/deposit", {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 10000000
    });
    await axios.post("http://localhost:3000/deposit", {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10000000
    });
    await axios.post("http://localhost:3000/place_order", {
        accountId: outputSignup.accountId,
        marketId,
        side: "buy",
        quantity: 1,
        price: 85000
    });
    const responsePlaceOrder = await axios.post("http://localhost:3000/place_order", {
        accountId: outputSignup.accountId,
        marketId,
        side: "sell",
        quantity: 1,
        price: 85000
    });
    const outputPlaceOrder = responsePlaceOrder.data;
    // const responseGetOrder = await axios.get(`http://localhost:3000/orders/${outputPlaceOrder.orderId}`);
    // const outputGetOrder = responseGetOrder.data;
    // console.log(outputGetOrder);
    const responseGetOrders = await axios.get(`http://localhost:3000/orders`);
    const outputGetOrders = responseGetOrders.data;
    console.log(outputGetOrders);
});
