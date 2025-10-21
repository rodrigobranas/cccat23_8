import Account from "./Account";
import pgp from "pg-promise";
import Asset from "./Asset";

export default interface AccountRepository {
    saveAccount (account: Account): Promise<void>;
    updateAccount (account: Account): Promise<void>;
    getAccount (accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
    
    async saveAccount (account: Account) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
        await connection.$pool.end();
    }

    async updateAccount (account: Account) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query("delete from ccca.account_asset where account_id = $1", [account.accountId]);
        for (const asset of account.assets) {
            await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [account.accountId, asset.assetId, asset.quantity]);
        }
        await connection.$pool.end();
    }

    async getAccount (accountId: string) {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
        const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        await connection.$pool.end();
        const assets: Asset[] = [];
        for (const accountAssetData of accountAssetsData) {
            assets.push(new Asset(accountAssetData.asset_id, parseFloat(accountAssetData.quantity)));
        }
        const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password, assets);
        return account;
    }

}