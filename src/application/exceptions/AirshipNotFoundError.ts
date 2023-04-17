export default class AirshipNotFoundError extends Error {
    constructor(airship: number) {
        super(`A aeronave ${airship} não foi encontrado`);
        this.name = 'PlanetAirshipNotFoundErrorNotFoundError';
    }
}