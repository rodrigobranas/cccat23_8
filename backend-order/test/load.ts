import axios from "axios";

axios.defaults.validateStatus = () => true;

export function sleep (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function main () {
    const input = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3002/signup", input);
    const outputSignup = responseSignup.data;
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
    while (true) {
        const inputOrder = {
            accountId: outputSignup.accountId,
            marketId: "BTC-USD",
            side: (Math.random() > 0.5) ? "buy" : "sell",
            quantity: 1 + Math.floor(Math.random() * 5),
            price: 85 + ((Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10))
        }
        await axios.post("http://localhost:3000/place_order", inputOrder);
        await sleep(100);
    }
    
}

main ();
