import AccountRepository from "./AccountRepository";

export default class Deposit {

    constructor (readonly accountRepository: AccountRepository) {
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepository.getAccount(input.accountId);
        if (!account) throw new Error("Account not found");
        account.deposit(input.assetId, input.quantity);
        await this.accountRepository.updateAccount(account);
    }

}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
