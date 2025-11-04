import Asset from "./Asset";
import Order from "./Order";
import UUID from "./UUID";

export default class Wallet {
    private accountId: UUID;
    assets: Asset[];

    constructor (accountId: string, assets: Asset[]) {
        this.accountId = new UUID(accountId);
        this.assets = assets;
    }

    static create (accountId: string) {
        const assets: Asset[] = [];
        return new Wallet(accountId, assets);
    }

    deposit (assetId: string, quantity: number) {
        if (quantity <= 0) throw new Error("Quantity must be positive");
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (asset) {
            asset.quantity += quantity;
        } else {
            this.assets.push(new Asset(assetId, quantity, 0));
        }
    }

    withdraw (assetId: string, quantity: number) {
        if (quantity <= 0) throw new Error("Quantity must be positive");
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (!asset || quantity > asset.quantity) throw new Error("Insufficient funds");
        asset.quantity -= quantity;
    }

    getBalance (assetId: string) {
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (!asset) return 0;
        return asset.getBalance();
    }

    processOrder (order: Order) {
        let assetId;
        let quantity;
        if (order.side === "buy") {
            assetId = order.getPaymentAssetId();
            quantity = (order.quantity * order.price);
        } else {
            assetId = order.getMainAssetId();
            quantity = order.quantity;
        }
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (!asset || quantity > asset.getBalance()) throw new Error("Insufficient funds");
        asset.blockedQuantity += quantity;
    }

    getAccountId () {
        return this.accountId.getValue();
    }

}
