export default class InsufficientFuelError extends Error {
    constructor() {
        super(`O combustível da aeronave é insuficiente para esta rota`);
        this.name = 'InsufficientFuelError';
    }
}