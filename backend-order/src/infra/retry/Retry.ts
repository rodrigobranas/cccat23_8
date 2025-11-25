import { sleep } from "../util/sleep";

export default class Retry {

    static async execute (fn: Function, retries: number = 3, timeout: number = 1000): Promise<any> {
        try {
            const output = await fn();
            return output;
        } catch (_: any) {
            if (retries > 0) {
                console.log("retrying...");
                await sleep(timeout);
                return Retry.execute(fn, retries - 1, timeout);
            } else {
                console.log("attempts exceeded");
            }
        }
    }
}