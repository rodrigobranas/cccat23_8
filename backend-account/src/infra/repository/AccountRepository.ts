import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface AccountRepository {
    saveAccount (account: Account): Promise<void>;
    updateAccount (account: Account): Promise<void>;
    getAccount (accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
    @inject("databaseConnection")
    connection!: DatabaseConnection;
    
    async saveAccount (account: Account) {
        await this.connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.getAccountId(), account.getName(), account.getEmail(), account.getDocument(), account.getPassword()]);
    }

    async updateAccount (account: Account) {
        await this.connection.query("update ccca.account set password = $1 where account_id = $2", [account.getPassword(), account.getAccountId()]);
    }

    async getAccount (accountId: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        if (!accountData) throw new Error("Account not found");
        const account = new Account(accountData.account_id, accountData.name, accountData.email, accountData.document, accountData.password);
        return account;
    }

}
