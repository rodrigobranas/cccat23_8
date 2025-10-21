import Account from "./Account";
import AccountRepository from "./AccountRepository";

export default class Signup {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (input: Input): Promise<Output> {
        const account = Account.build(input);
        await this.accountRepository.saveAccount(account);
        return {
            accountId: account.accountId
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
