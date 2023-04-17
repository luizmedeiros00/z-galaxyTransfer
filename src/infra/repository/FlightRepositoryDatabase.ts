
import FlightRepository from "../../application/repository/FlightRepository";
import Flight from "../../domain/entity/flights/Flight";
import FlightDataRepository from "../../domain/entity/flights/FlightDataRepository";
import Connection from "../database/Connection";

export default class FlightRepositoryDatabase implements FlightRepository {

    constructor(
        readonly connection: Connection,
    ) { }

    async getLastFlightByAirship(airshipId: number): Promise<Flight | null> {
        const query = `select flights.*, airships.model as airship_model 
            from flights as flights join airships as airships on flights.airship_id = airships.id 
            where airship_id = $1 order by id desc limit 1`;
        const result = await this.connection.one(query, [airshipId]);
        if (!result) {
            return null
        }
        return new Flight(
            result.id,
            result.start_at,
            result.arrival_at,
            result.destination_planet,
            result.origin_planet,
            result.airship_id,
            result.airship_model,
            result.initial_capacity,
            result.final_capacity
        )
    }

    async save(flightData: FlightDataRepository): Promise<void> {
        const query = `
        INSERT INTO flights (start_at, arrival_at, destination_planet, origin_planet, airship_id, initial_capacity, final_capacity) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await this.connection.query(query, [
            flightData.startAt,
            flightData.arrivalAt,
            flightData.destinationPlanetId,
            flightData.originPlanetId,
            flightData.airshipId,
            flightData.initialCapacity,
            flightData.finalCapacity
        ]);
    }

    async getByAviatorId(aviatorId: number): Promise<Flight[] | null> {
        const query = `SELECT flights.id, flights.start_at, flights.arrival_at, flights.initial_capacity, flights.final_capacity, flights.airship_id, 
        airships.model as airship_model, origin_planet.name as origin_planet, destination_planet.name as destination_planet
        FROM public.flights as flights join airships as airships on flights.airship_id = airships.id
        join aviator as aviator on aviator.id = airships.aviator_id
        join planets as origin_planet on flights.origin_planet = origin_planet.id
        join planets as destination_planet on flights.destination_planet = destination_planet.id
        where aviator.id  = $1`

        const result = await this.connection.query(query, [aviatorId]);

        if(!result) {
            return null;
        }

        const flights = []
        for(const flight of result) {
            flights.push(new Flight(
                flight.id,
                flight.start_at,
                flight.arrival_at,
                flight.destination_planet,
                flight.origin_planet,
                flight.airship_id,
                flight.airship_model,
                flight.initial_capacity,
                flight.final_capacity
            ))
        }

        return flights;
    }
}