import Wallet from "../../domain/Wallet";
import Asset from "../../domain/Asset";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface WalletRepository {
    upsertWallet (wallet: Wallet): Promise<void>;
    getWallet (accountId: string): Promise<Wallet>;
}

export class WalletRepositoryDatabase implements WalletRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async upsertWallet (wallet: Wallet) {
        await this.connection.query("delete from ccca.account_asset where account_id = $1", [wallet.getAccountId()]);
        for (const asset of wallet.assets) {
            await this.connection.query("insert into ccca.account_asset (account_id, asset_id, quantity, blocked_quantity) values ($1, $2, $3, $4)", [wallet.getAccountId(), asset.assetId, asset.quantity, asset.blockedQuantity]);
        }
    }

    async getWallet (accountId: string) {
        const [accountData] = await this.connection.query("select 1 from ccca.account where account_id = $1", [accountId]);
        if (!accountData) throw new Error("Account not found");
        const accountAssetsData = await this.connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        const assets: Asset[] = [];
        for (const accountAssetData of accountAssetsData) {
            assets.push(new Asset(accountAssetData.asset_id, parseFloat(accountAssetData.quantity), parseFloat(accountAssetData.blocked_quantity)));
        }
        const wallet = new Wallet(accountId, assets);
        return wallet;
    }

}
