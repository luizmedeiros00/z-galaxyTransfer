export default class LastFlightNotCompletedError extends Error {
    constructor() {
        super(`Aguarde seu último voo ser finalizado`);
        this.name = 'LastFlightNotCompletedError';
    }
}