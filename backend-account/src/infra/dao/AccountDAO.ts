import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";

export default interface AccountDAO {
    getAccount (accountId: string): Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
    @inject("databaseConnection")
    connection!: DatabaseConnection;

    async getAccount (accountId: string) {
        const [accountData] = await this.connection.query("select * from ccca.account where account_id = $1", [accountId]);
        if (!accountData) throw new Error("Account not found");
        return accountData;
    }

}
