export default class Route {
    constructor(
        readonly originPlanet: number,
        readonly destinationPlanet: number,
        readonly expense: number
    ) { }

    getOriginPlanet(): number {
        return this.originPlanet
    }

    getDestinationPlanet(): number {
        return this.destinationPlanet
    }

    getExpense(): number {
        return this.expense;
    }
}