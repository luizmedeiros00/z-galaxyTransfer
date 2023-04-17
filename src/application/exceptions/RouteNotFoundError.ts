export default class RouteNotFoundError extends Error {
    constructor() {
        super(`Rota de Voo não encontrada`);
        this.name = 'RouteNotFoundError';
    }
}