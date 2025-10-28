export default class Password {
    private value: string;

    constructor (value: string) {
        if (
            value.length < 8 || 
            !value.match(/[a-z]/) || 
            !value.match(/[A-Z]/) || 
            !value.match(/[0-9]/)
        ) throw new Error("Invalid password");
        this.value = value;
    }

    getValue () {
        return this.value;
    }

}
