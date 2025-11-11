const CPF_LENGTH = 11;

export function validateCpf (cpf: string) {
	if (!cpf) return false;
	cpf = clean(cpf);
	if (cpf.length !== CPF_LENGTH) return false;
	if (isSameSequence(cpf)) return false;
	const digit1 = calculateDigit(cpf, 10);
	const digit2 = calculateDigit(cpf, 11);
	return extractDigit(cpf) === `${digit1}${digit2}`;
}

function clean (cpf: string) {
	return cpf.replace(/\D/g, "");
}

function isSameSequence (cpf: string) {
	const [firstDigit] = cpf;
	return [...cpf].every(digit => digit === firstDigit);
}

function calculateDigit (cpf: string, factor: number) {
	let sum = 0;
	for (const digit of cpf) {
		if (factor > 1) sum += parseInt(digit) * factor--;
	}
	const rest = sum%CPF_LENGTH;
	return (rest < 2) ? 0 : CPF_LENGTH - rest;
}

function extractDigit (cpf: string) {
	return cpf.slice(9);
}