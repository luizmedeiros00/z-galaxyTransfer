export default class AviatorNotFoundError extends Error {
    constructor() {
        super(`Piloto não encontrado`);
        this.name = 'AviatorNotFoundError';
    }
}