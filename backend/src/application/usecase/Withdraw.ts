import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class Withdraw {
    @inject("accountRepository")
        accountRepository!: AccountRepository;

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getAccount(input.accountId);
        if (!account) throw new Error("Account not found");
        account.withdraw(input.assetId, input.quantity);
        await this.accountRepository.updateAccount(account);
    }

}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
