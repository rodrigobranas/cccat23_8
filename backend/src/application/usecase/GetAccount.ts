import Asset from "../../domain/Asset";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class GetAccount {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("walletRepository")
    walletRepository!: WalletRepository;

    async execute (accountId: string): Promise<Output> {
        const account = await this.accountRepository.getAccount(accountId);
        const wallet = await this.walletRepository.getWallet(accountId);
        const output = {
            accountId: account.getAccountId(),
            name: account.getName(),
            email: account.getEmail(),
            document: account.getDocument(),
            password: account.getPassword(),
            assets: wallet.assets.map((asset: Asset) => ({ assetId: asset.assetId, quantity: asset.quantity }))
        }
        return output;
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    document: string,
    password: string,
    assets: { assetId: string, quantity: number }[]
}