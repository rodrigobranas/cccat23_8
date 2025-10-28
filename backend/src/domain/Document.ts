export default class Document {
    private CPF_LENGTH = 11;
    private value: string;

    constructor (value: string) {
        if (!this.validate(value)) throw new Error("Invalid document");
        this.value = value;
    }

    getValue () {
        return this.value;
    }

    private validate (cpf: string) {
        if (!cpf) return false;
        cpf = this.clean(cpf);
        if (cpf.length !== this.CPF_LENGTH) return false;
        if (this.isSameSequence(cpf)) return false;
        const digit1 = this.calculateDigit(cpf, 10);
        const digit2 = this.calculateDigit(cpf, 11);
        return this.extractDigit(cpf) === `${digit1}${digit2}`;
    }

    private clean (cpf: string) {
        return cpf.replace(/\D/g, "");
    }

    private isSameSequence (cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every(digit => digit === firstDigit);
    }

    private calculateDigit (cpf: string, factor: number) {
        let sum = 0;
        for (const digit of cpf) {
            if (factor > 1) sum += parseInt(digit) * factor--;
        }
        const rest = sum%this.CPF_LENGTH;
        return (rest < 2) ? 0 : this.CPF_LENGTH - rest;
    }

    private extractDigit (cpf: string) {
        return cpf.slice(9);
    }

}
