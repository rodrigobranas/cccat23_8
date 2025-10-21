import { validatePassword } from "../src/validatePassword";

test.each([
    "asdQWE123"
])("Deve testar uma senha válida %s", (password: string) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(true);
});

test.each([
    "asd",
    "asdASD",
    "123456",
    "ASQW12"
])("Deve testar um senha inválida %s", (password: any) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
});
