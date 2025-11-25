import { CieloPaymentGateway, PJBankPaymentGateway } from "../gateway/PaymentGateway";
import Retry from "../retry/Retry";

export default interface PaymentProcessor {
    next?: PaymentProcessor;
    processPayment (input: any): Promise<any>;
}

export class CieloPaymentProcessor implements PaymentProcessor {
    
    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const cieloPaymentGateway = new CieloPaymentGateway();
            const output = await cieloPaymentGateway.processTransaction(input);
            return output
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return await this.next.processPayment(input);
        }
    }

}

export class PJBankPaymentProcessor implements PaymentProcessor {
    
    constructor (readonly next?: PaymentProcessor) {
    }

    async processPayment(input: any): Promise<any> {
        try {
            const pjbankPaymentGateway = new PJBankPaymentGateway();
            let output;
            await Retry.execute(async () => {
                output = await pjbankPaymentGateway.processTransaction(input);
            }, 3, 1000);
            if (!output) throw new Error();
            return output;
        } catch (_: any) {
            if (!this.next) throw new Error("No processor");
            return await this.next.processPayment(input);
        }
    }

}
