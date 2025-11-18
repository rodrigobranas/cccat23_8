import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";


export function sleep (time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function main () {
    const connection = new PgPromiseAdapter();
    while (true) {
        const [stats] = await connection.query(`
            SELECT
                date_trunc('second', "timestamp") AS second,
                COUNT(*) AS orders_count
            FROM ccca.order
            GROUP BY 1
            ORDER BY 1 desc
            LIMIT 10
        `, []);
        console.log(stats);
        await sleep(1000);
    }
    
}

main ();
