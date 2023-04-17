export default class InvalidDataFlightError extends Error {
    constructor() {
        super(`A data de chegada não pode ser anterior à data de partida`);
        this.name = 'InvalidDataFlightError';
    }
}