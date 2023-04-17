export default class InvalidFlyCardNumberError extends Error {
    constructor(flyCardNumber: number) {
        super(`O FlyCard ${flyCardNumber} é inválido`);
        this.name = 'InvalidFlyCardNumberError';
    }
}