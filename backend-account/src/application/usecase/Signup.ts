import Account from "../../domain/Account";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class Signup {
    @inject("accountRepository")
    accountRepository!: AccountRepository;

    async execute (input: Input): Promise<Output> {
        const account = Account.build(input);
        await this.accountRepository.saveAccount(account);
        return {
            accountId: account.getAccountId()
        };
    }

}

type Input = {
    name: string,
    email: string,
    document: string,
    password: string
}

type Output = {
    accountId: string
}
