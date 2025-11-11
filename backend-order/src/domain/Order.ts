import UUID from "./UUID";

export default class Order {
    private orderId: UUID;
    private accountId: UUID;

    constructor (
        orderId: string, 
        accountId: string, 
        readonly marketId: string, 
        readonly side: string, 
        readonly quantity: number, 
        readonly price: number, 
        private status: string, 
        readonly timestamp: Date,
        private fillQuantity: number,
        private fillPrice: number
    ) {
        this.orderId = new UUID(orderId);
        this.accountId = new UUID(accountId);
    }

    static create (accountId: string, marketId: string, side: string, quantity: number, price: number) {
        const orderId = UUID.create();
        const status = "open";
        const timestamp = new Date();
        return new Order(orderId.getValue(), accountId, marketId, side, quantity, price, status, timestamp, 0, 0);
    }

    fill (quantity: number, price: number) {
        if (this.getAvailableQuantity() < quantity) throw new Error("Insufficient quantity");
        this.fillQuantity += quantity;
        this.fillPrice = price;
        if (this.getAvailableQuantity() === 0) this.status = "closed";
    }

    getMainAssetId () {
        const [mainAssetId, paymentAssetId] = this.marketId.split("-");
        return mainAssetId;
    }

    getPaymentAssetId () {
        const [mainAssetId, paymentAssetId] = this.marketId.split("-");
        return paymentAssetId;
    }

    getOrderId () {
        return this.orderId.getValue();
    }

    getAccountId () {
        return this.accountId.getValue();
    }

    getFillQuantity () {
        return this.fillQuantity;
    }

    getFillPrice () {
        return this.fillPrice;
    }

    getAvailableQuantity () {
        return this.quantity - this.fillQuantity;
    }

    getStatus () {
        return this.status;
    }

}
