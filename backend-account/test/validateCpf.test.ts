import { validateCpf } from "../src/domain/validateCpf";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Deve testar um cpf válido %s", (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
});

test.each([
    null,
    undefined,
    "111111111111",
    "1111111111",
    "11111111111111"
])("Deve testar um cpf inválido %s", (cpf: any) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
});
