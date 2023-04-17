export default class PlanetNotFoundError extends Error {
    constructor(planetName: string) {
        super(`Planeta ${planetName} não foi encontrado`);
        this.name = 'PlanetNotFoundError';
    }
}