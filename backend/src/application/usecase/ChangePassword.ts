import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class ChangePassword {
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getAccount(input.accountId);
        account.setPassword(input.newPassword);
        await this.accountRepository.updateAccount(account);
    }
}

type Input = {
    accountId: string,
    newPassword: string
}