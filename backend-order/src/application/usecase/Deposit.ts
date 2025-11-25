import { inject } from "../../infra/di/Registry";
import { CieloPaymentProcessor, PJBankPaymentProcessor } from "../../infra/fallback/PaymentProcessor";
import { CieloPaymentGateway, PJBankPaymentGateway } from "../../infra/gateway/PaymentGateway";
import WalletRepository from "../../infra/repository/WalletRepository";
import Retry from "../../infra/retry/Retry";

export default class Deposit {
    @inject("walletRepository")
    walletRepository!: WalletRepository;

    async execute (input: Input): Promise<void> {
        const wallet = await this.walletRepository.getWallet(input.accountId);
        wallet.deposit(input.assetId, input.quantity);
        await this.walletRepository.upsertWallet(wallet);
        // const paymentGateway = new CieloPaymentGateway();
        // const paymentGateway = new PJBankPaymentGateway();
        // await Retry.execute(async () => {
        //     const outputProcessTransaction = await paymentGateway.processTransaction({ amount: input.quantity, creditCardToken: "abc123" });
        //     console.log(outputProcessTransaction);
        // }, 4, 500);
        // const paymentProcessor = new PJBankPaymentProcessor(new CieloPaymentProcessor());
        // await paymentProcessor.processPayment({ amount: input.quantity, creditCardToken: "abc123" });
    }

}

type Input = {
    accountId: string,
    assetId: string,
    quantity: number
}
