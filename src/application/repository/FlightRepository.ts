import Flight from "../../domain/entity/flights/Flight";
import FlightDataRepository from "../../domain/entity/flights/FlightDataRepository"

export default interface FlightRepository {
    save(data: FlightDataRepository): Promise<void>
    getLastFlightByAirship(airshipId: number): Promise<Flight | null>;
    getByAviatorId(aviatorId: number): Promise<Flight[] | null>;
}