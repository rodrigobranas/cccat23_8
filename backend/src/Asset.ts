export default class Asset {
    
    constructor (readonly assetId: string, public quantity: number) {
        if (quantity <= 0) throw new Error("Quantity must be positive");
    }
}
