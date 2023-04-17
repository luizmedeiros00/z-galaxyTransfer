export default class AviatorAlreadyExistsError extends Error {
    constructor(flyCardNumber: number) {
        super(`Já existe um piloto com o número de FlyCard '${flyCardNumber}'`);
        this.name = 'AviatorAlreadyExistsError';
    }
}