import { differenceInDays } from 'date-fns';

export default class Airship {
    constructor(
        readonly id: number,
        readonly model: string,
        readonly yearManufacture: number,
        readonly fuelCapacity: number,
        private currentCapacity: number,
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

    toFuel(lastFlightDate: Date, startDateNewFlight: Date):boolean {
        const newLastFlightDate = new Date(lastFlightDate.getFullYear(), lastFlightDate.getMonth(), lastFlightDate.getDate());
        const newStartDateNewFlight = new Date(startDateNewFlight.getFullYear(), startDateNewFlight.getMonth(), startDateNewFlight.getDate());
        if (this.currentCapacity === 0 && newStartDateNewFlight > newLastFlightDate) {
            this.currentCapacity = this.getFuelCapacity()
            return true;
        }
        return false;
    }
}