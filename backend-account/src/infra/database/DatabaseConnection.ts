import pgp from "pg-promise";

export default interface DatabaseConnection {
    query (statement: string, data: any): Promise<any>;
    close (): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
    connection: pgp.IDatabase<{}>;

    constructor () {
        this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    }

    async query(statement: string, data: any): Promise<any> {
        return this.connection.query(statement, data);
    }

    async close(): Promise<void> {
        await this.connection.$pool.end();
    }

}
