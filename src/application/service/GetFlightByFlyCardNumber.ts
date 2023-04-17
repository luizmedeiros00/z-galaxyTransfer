import AviatorRepository from "../repository/AviatorRepository";
import AviatorNotFoundError from "../exceptions/AviatorNotFoundError";
import FlightRepository from "../repository/FlightRepository";
import Flight from "../../domain/entity/flights/Flight";

export default class GetFlightByFlyCardNumber {
    constructor(
        readonly aviatorRepository: AviatorRepository,
        readonly flightRepository: FlightRepository
    ) { }

    async execute(flyCardNumber: number): Promise<Flight[] | null> {

        const aviator = await this.aviatorRepository.findByFlyCardNumber(flyCardNumber);

        if (!aviator) {
            throw new AviatorNotFoundError()
        }
     
        const flights = await this.flightRepository.getByAviatorId(aviator.id)

        return flights;
    }
}