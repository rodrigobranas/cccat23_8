import Asset from "../../domain/Asset";
import { inject } from "../../infra/di/Registry";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class GetWallet {
    @inject("walletRepository")
    walletRepository!: WalletRepository;

    async execute (accountId: string): Promise<Output> {
        const wallet = await this.walletRepository.getWallet(accountId);
        const output = {
            accountId,
            assets: wallet.assets.map((asset: Asset) => ({ assetId: asset.assetId, quantity: asset.quantity }))
        }
        return output;
    }
}

type Output = {
    accountId: string,
    assets: { assetId: string, quantity: number }[]
}
