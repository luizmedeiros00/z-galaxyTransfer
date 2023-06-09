import FlightRepository from "../repository/FlightRepository";
import FlightData from "../../domain/entity/flights/FlightData";
import FlightValidator from "../validators/FlightValidator";
import InvalidDataFlightError from "../exceptions/InvalidDataFlightError";
import AirshipRespository from "../repository/AirshipRespository";
import RoutesRepository from "../repository/RoutesRepository";
import AviatorRepository from "../repository/AviatorRepository";
import PlanetRepository from "../repository/PlanetRepository";
import PlanetNotFoundError from "../exceptions/PlanetNotFoundError";
import AirshipNotFoundError from "../exceptions/AirshipNotFoundError";
import RouteNotFoundError from "../exceptions/RouteNotFoundError";
import AviatorNotFoundError from "../exceptions/AviatorNotFoundError";
import InsufficientFuelError from "../exceptions/InsufficientFuelError";
import LastFlightNotCompletedError from "../exceptions/LastFlightNotCompletedError";

export default class SaveFlight {
    constructor(
        readonly flightRepository: FlightRepository,
        readonly airshipRepository: AirshipRespository,
        readonly routeRepository: RoutesRepository,
        readonly aviatorRepository: AviatorRepository,
        readonly planetRepository: PlanetRepository
    ) { }

    async execute(flightData: FlightData) {
        if (!FlightValidator.validateDates(flightData)) {
            throw new InvalidDataFlightError()
        }

        const airship = await this.airshipRepository.findById(flightData.airshipId)
        if (!airship) {
            throw new AirshipNotFoundError(flightData.airshipId);
        }

        const aviator = await this.aviatorRepository.findById(airship.aviatorId)
        if (!aviator) {
            throw new AviatorNotFoundError();
        }

        const destinationPlanet = await this.planetRepository.getByName(flightData.destinationPlanet);
        if (!destinationPlanet) {
            throw new PlanetNotFoundError(flightData.destinationPlanet);
        }

        const route = await this.routeRepository.getByOriginAndDestination(aviator.gePlanetId(), destinationPlanet.getId())
        if (!route) {
            throw new RouteNotFoundError();
        }

        const lastFlight = await this.flightRepository.getLastFlightByAirship(flightData.airshipId)
        if (lastFlight && !lastFlight.finished(flightData.startAt)) {
            throw new LastFlightNotCompletedError()
        }

        let currentCapacity = airship.getCurrentCapacity()
        const needToFuel = lastFlight && currentCapacity === 0 && FlightValidator.isTomorrow(lastFlight.getArrivalAt(), flightData.startAt)
        if (needToFuel) {
            currentCapacity = airship.getFuelCapacity()
        }

        if (route.getExpense() > currentCapacity) {
            throw new InsufficientFuelError();
        }

        const finalCapacity = currentCapacity - route.getExpense()

        const newFlightData = {
            startAt: flightData.startAt,
            arrivalAt: flightData.arrivalAt,
            originPlanetId: aviator.gePlanetId(),
            destinationPlanetId: destinationPlanet.getId(),
            airshipId: airship.getId(),
            initialCapacity: currentCapacity,
            finalCapacity: finalCapacity,
        }

        await this.flightRepository.save(newFlightData);
        await this.airshipRepository.updateCurrentCapacity(airship.id, finalCapacity)
        await this.aviatorRepository.updatePlanet(aviator.getId(), destinationPlanet.getId())
    }
}