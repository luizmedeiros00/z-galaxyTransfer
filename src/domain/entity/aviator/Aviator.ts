import Airship from "../airship/Airship"

export default class Aviator {
    private arships: Airship[]

    constructor(
        readonly id: number,
        readonly name: string,
        readonly flyCardNumber: number,
        readonly planetId: number,
        readonly currentPlanet: string
    ) {
        this.arships = []
    }

    getId(): number {
        return this.id
    }

    getName(): string {
        return this.name
    }

    getFlyCardNumber(): number {
        return this.flyCardNumber
    }

    gePlanetId(): number {
        return this.planetId
    }

    getCurrentPlanet(): string {
        return this.currentPlanet
    }

    addAirship(airshipt: Airship): void {
        this.arships.push(airshipt)
    }

    getAirships(): Airship[] {
        return this.arships
    }
}