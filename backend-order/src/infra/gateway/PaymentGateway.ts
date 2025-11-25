import axios from "axios";

export default interface PaymentGateway {
    processTransaction (input: Input): Promise<Output>;
}

type Input = {
    amount: number,
    creditCardToken: string
}

type Output = {
    tid: string,
    authorizationCode: string,
    status: "approved" | "rejected"
}

export class CieloPaymentGateway implements PaymentGateway {

    async processTransaction(input: Input): Promise<Output> {
        console.log("process transaction cielo");
        let transaction = {  
			"MerchantOrderId":"2014111701",
			 "Customer":{  
			   "Name":"Comprador Teste",
			   "Identity":"11225468954",
			   "IdentityType":"CPF",
			   "Email":"compradorteste@teste.com",
			   "Birthdate":"1991-01-02",
			   "Address":{  
				  "Street":"Rua Teste",
				  "Number":"123",
				  "Complement":"AP 123",
				  "ZipCode":"12345987",
				  "City":"Rio de Janeiro",
				  "State":"RJ",
				  "Country":"BRA"
			   },
				 "DeliveryAddress": {
					 "Street": "Rua Teste",
					 "Number": "123",
					 "Complement": "AP 123",
					 "ZipCode": "12345987",
					 "City": "Rio de Janeiro",
					 "State": "RJ",
					 "Country": "BRA"
				 }
			},
			"Payment":{  
			  "Type":"CreditCard",
			  "Amount":15700,
			  "Currency":"BRL",
			  "Country":"BRA",
			  "Provider":"Simulado",
			  "ServiceTaxAmount":0,
			  "Installments":1,
			  "Interest":"ByMerchant",
			  "Capture":false,
			  "Authenticate":false,    
			  "Recurrent": false,
			  "SoftDescriptor":"123456789ABCD",
			  "CreditCard":{  
				  "CardNumber":"4024007197692931",
				  "Holder":"Teste Holder",
				  "ExpirationDate":"12/2021",
				  "SecurityCode":"123",
				  "SaveCard":"false",
				  "Brand":"Visa"
			  }
			}
		 }
		
		const request = {
			url: `https://apisandbox.cieloecommerce.cielo.com.br/1/sales/`,
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				MerchantId: "10631719-a8b9-44fa-8053-1d856ca3cac7",
				MerchantKey: "TWFYUFSEXRRPQGCUQLHFHGEXWEDNOPQTXGUFDSQH"
			},
			data: transaction
		}
        const response = await axios(request);
        const outputCielo = response.data;
        const status = (outputCielo.Payment.ReturnCode === "4") ? "approved" : "rejected";
        const output: Output = {
            tid: outputCielo.Payment.Tid,
            authorizationCode: outputCielo.Payment.AuthorizationCode,
            status
        }
        return output;
    }

}

export class PJBankPaymentGateway implements PaymentGateway {

    async processTransaction(input: Input): Promise<Output> {
        console.log("process transaction pjbank");
		throw new Error("out of service");
        const [mes, ano] = "05/2027".split("/");
		const creditCard = {
			nome_cartao: "Cliente Exemplo",
			numero_cartao: "4012001037141112",
			mes_vencimento: mes,
			ano_vencimento: ano,
			cpf_cartao: "64111456529",
			codigo_cvv: "123",
			email_cartao: "api@pjbank.com.br"
		};
		const request1 = {
			url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/tokens`,
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8"
			},
			data: creditCard
		};
		const output1 = await axios(request1);
		let transaction = {
			pedido_numero: "1",
			token_cartao: output1.data.token_cartao,
			valor: 100000,
			parcelas: 1,
			descricao_pagamento: ""
		};
		
		const request2 = {
			url: `https://sandbox.pjbank.com.br/recebimentos/e0727263cc7a983f0aae5411ad86c5a144b8ed28/transacoes`,
			method: "POST",
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"X-CHAVE": "e9db986de751de918ca19a1c377f0b7c313915f8"
			},
			data: transaction
		}
		
		const response2 = await axios(request2);
        const outputPJBank = response2.data;
        const status = (outputPJBank.autorizada === "1") ? "approved" : "rejected";
        const output: Output = {
            tid: outputPJBank.tid,
            authorizationCode: outputPJBank.autorizacao,
            status
        }
        return output;
    }

}