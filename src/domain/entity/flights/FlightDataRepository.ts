export default interface FlightDataRepository {
    startAt: Date,
    arrivalAt: Date,
    originPlanetId: number,
    destinationPlanetId: number,
    airshipId: number,
    initialCapacity: number,
    finalCapacity: number,
}