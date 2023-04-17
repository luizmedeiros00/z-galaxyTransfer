import { isAfter } from 'date-fns';

export default class Flight {
    constructor(
        readonly id: number,
        readonly startAt: Date,
        readonly arrivalAt: Date,
        readonly destinationPlanet: string,
        readonly originPlanet: string,
        readonly airshipId: number,
        readonly airshipModel: string,
        readonly initialCapacity: number,
        readonly finalCapacity: number,
    ) { }

    getId(): number {
        return this.id
    }

    getStartAt(): Date {
        return this.startAt
    }

    getArrivalAt(): Date {
        return new Date(this.arrivalAt)
    }

    getDestinationPlanet(): string {
        return this.destinationPlanet
    }

    getOriginPlanet(): string {
        return this.originPlanet
    }

    getAirshipModel(): string {
        return this.airshipModel
    }

    getAirshipId(): number {
        return this.airshipId
    }

    getInitialCapacity(): number {
        return this.initialCapacity
    }

    getFinalCapacity(): number {
        return this.finalCapacity
    }

    finished(date: Date): boolean {
        return date.getTime() > this.getArrivalAt().getTime() 
    }
}   
