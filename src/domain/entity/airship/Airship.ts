export default class Airship {
    constructor(
        readonly id: number,
        readonly model: string,
        readonly yearManufacture: number,
        readonly fuelCapacity: number,
        readonly currentCapacity: number,
        readonly aviatorId: number
    ) { }

    getId(): number {
        return this.id
    }

    getModel(): string {
        return this.model
    }

    getYearManufacture(): number {
        return this.yearManufacture
    }

    getFuelCapacity(): number {
        return this.fuelCapacity
    }

    getCurrentCapacity(): number {
        return this.currentCapacity
    }

    getAviatorId(): number {
        return this.aviatorId
    }

}