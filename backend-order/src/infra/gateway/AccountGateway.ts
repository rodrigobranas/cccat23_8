import axios from "axios";

export default interface AccountGateway {
    signup (input: SignupInput): Promise<SignupOutput>
}

type SignupInput = {
    name: string,
    email: string,
    document: string,
    password: string
}

type SignupOutput = {
    accountId: string
}

export class AccountGatewayHttp implements AccountGateway {

    async signup(input: SignupInput): Promise<SignupOutput> {
        const response = await axios.post("http://localhost:3002/signup", input);
        const output = response.data;
        return output;
    }

}
