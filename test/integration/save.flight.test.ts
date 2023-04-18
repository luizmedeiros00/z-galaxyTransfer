import AirshipNotFoundError from "../../src/application/exceptions/AirshipNotFoundError";
import AviatorNotFoundError from "../../src/application/exceptions/AviatorNotFoundError";
import InsufficientFuelError from "../../src/application/exceptions/InsufficientFuelError";
import InvalidDataFlightError from "../../src/application/exceptions/InvalidDataFlightError";
import LastFlightNotCompletedError from "../../src/application/exceptions/LastFlightNotCompletedError";
import PlanetNotFoundError from "../../src/application/exceptions/PlanetNotFoundError";
import RouteNotFoundError from "../../src/application/exceptions/RouteNotFoundError";
import AirshipRespository from "../../src/application/repository/AirshipRespository";
import AviatorRepository from "../../src/application/repository/AviatorRepository";
import FlightRepository from "../../src/application/repository/FlightRepository";
import PlanetRepository from "../../src/application/repository/PlanetRepository";
import RoutesRepository from "../../src/application/repository/RoutesRepository";
import SaveFlight from "../../src/application/service/SaveFlight";
import FlightValidator from "../../src/application/validators/FlightValidator";
import Airship from "../../src/domain/entity/airship/Airship";
import Aviator from "../../src/domain/entity/aviator/Aviator";
import Flight from "../../src/domain/entity/flights/Flight";
import FlightData from "../../src/domain/entity/flights/FlightData";
import Planet from "../../src/domain/entity/Planet";
import Route from "../../src/domain/entity/route/Route";

jest.mock('../../src/application/repository/FlightRepository');
jest.mock('../../src/application/repository/AirshipRespository');
jest.mock('../../src/application/repository/RoutesRepository');
jest.mock('../../src/application/repository/AviatorRepository');
jest.mock('../../src/application/repository/PlanetRepository');

describe("SaveFlight", () => {
    let mockFlightRepository: jest.Mocked<FlightRepository>;
    let mockAirshipRepository: jest.Mocked<AirshipRespository>;
    let mockRoutesRepository: jest.Mocked<RoutesRepository>;
    let mockAviatorRepository: jest.Mocked<AviatorRepository>;
    let mockPlanetRepository: jest.Mocked<PlanetRepository>;
    let saveFlight: SaveFlight;
    let flightData: FlightData

    beforeEach(() => {
        mockFlightRepository = {
            save: jest.fn(),
            getLastFlightByAirship: jest.fn(),
            getByAviatorId: jest.fn()
        }

        mockAirshipRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            updateCurrentCapacity: jest.fn(),
            getAirshipsByAviatorId: jest.fn()
        }

        mockRoutesRepository = {
            getByOriginAndDestination: jest.fn()
        }

        mockAviatorRepository = {
            findByFlyCardNumber: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            updatePlanet: jest.fn()
        }

        mockPlanetRepository = {
            getByName: jest.fn()
        }

        saveFlight = new SaveFlight(
            mockFlightRepository,
            mockAirshipRepository,
            mockRoutesRepository,
            mockAviatorRepository,
            mockPlanetRepository
        )

        flightData = {
            startAt: new Date('2023-04-17 13:00:00'),
            arrivalAt: new Date('2023-04-18 13:00:00'),
            destinationPlanet: 'Planet',
            airshipId: 1,
        }
    })

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Deve lançar InvalidDataFlightError quando as datas do voo forem invalido', async () => {
        flightData.arrivalAt = new Date('2023-04-16 13:00:00')
        const validateDatesSpy = jest.spyOn(FlightValidator, 'validateDates').mockReturnValue(false);
        await expect(saveFlight.execute(flightData)).rejects.toThrow(InvalidDataFlightError);
        expect(validateDatesSpy).toHaveBeenCalledWith(flightData);
    });

    test('Deve lançar AirshipNotFoundError quando a aeronave fornecida não existir', async () => {
        flightData.arrivalAt = new Date('2023-04-18 13:00:00')
        const findByIdSpy = jest.spyOn(mockAirshipRepository, 'findById').mockResolvedValue(null);
        await expect(saveFlight.execute(flightData)).rejects.toThrow(AirshipNotFoundError);
        expect(findByIdSpy).toHaveBeenCalledWith(flightData.airshipId);
    });

    test("Deve lançar o erro AviatorNotFoundError quando o piloto nao for encontrado", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 100, 1)
        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        // mockFlightRepository.getLastFlightByAirship.mockResolvedValue(null)
        const findAviator = mockAviatorRepository.findById.mockResolvedValue(null)
        await expect(saveFlight.execute(flightData)).rejects.toThrow(AviatorNotFoundError)
        expect(findAviator).toHaveBeenCalledWith(airshipMock.getId())
    })

    test("Deve lançar o erro PlanetNotFoundError se o planeta de destino passado por flightData não for encontrado", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 100, 1)
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        // mockFlightRepository.getLastFlightByAirship.mockResolvedValue(null)
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        const findPlanet = mockPlanetRepository.getByName.mockResolvedValue(null)
        await expect(saveFlight.execute(flightData)).rejects.toThrow(PlanetNotFoundError)
        expect(findPlanet).toHaveBeenCalledWith(flightData.destinationPlanet)
    })

    test("Deve lançar o erro RouteNotFoundError se a rota não for encontrada com o planeta atual do piloto e o planeta destino de flightData", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 100, 1)
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)

        const findRoute = mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(null)
        await expect(saveFlight.execute(flightData)).rejects.toThrow(RouteNotFoundError)
        expect(findRoute).toHaveBeenCalledWith(aviatorMock.gePlanetId(), planetMock.getId())
    })

    test("Deve lançar LastFlightNotCompletedError se o ultimo voo não tiver sido finalizado", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 50, 1)
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");
        const routeMock = new Route(1, 2, 100)
        const lastFlight = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)
        lastFlight.finished = jest.fn()
        flightData.arrivalAt = new Date('2023-04-29 14:00:00')
        flightData.startAt = new Date('2023-04-19 14:00:00') // setando uma data antes da data de chegada do ultimo voo
        
        mockAirshipRepository.findById.mockResolvedValue(airshipMock)
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)
        mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(routeMock)
        mockFlightRepository.getLastFlightByAirship.mockResolvedValueOnce(lastFlight)
        await expect(saveFlight.execute(flightData)).rejects.toThrow(LastFlightNotCompletedError)
        expect(lastFlight.finished).toHaveBeenCalledWith(flightData.startAt)
    })

    test("Deve lançar o erro InsufficientFuelError se a capacidade da aeronave for menor que o custo da rota", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 10, 1) // Capacidade menor do que o custo da rota
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");
        const routeMock = new Route(1, 2, 20) // custo da rota é 20
        const lastFlight = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)

        flightData.startAt = new Date('2023-04-29 14:00:00') // setando uma data um dia após da data de chegada do ultimo voo
        flightData.arrivalAt = new Date('2023-05-01 14:00:00')

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)
        mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(routeMock)
        mockFlightRepository.getLastFlightByAirship.mockResolvedValueOnce(lastFlight)

        await expect(saveFlight.execute(flightData)).rejects.toThrow(InsufficientFuelError)  
    })

    test("Deve lançar o erro InsufficientFuelError se a capacidade da aeronave estiver 0 mas o dia da viagem ainda não é o próximo dia", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 0, 1) // Capacidade zerada
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");
        const routeMock = new Route(1, 2, 20)
        const lastFlight = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)

        flightData.startAt = new Date('2023-04-20 16:00:00') // setando uma data um dia após da data de chegada do ultimo voo
        flightData.arrivalAt = new Date('2023-05-01 14:00:00')

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)
        mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(routeMock)
        mockFlightRepository.getLastFlightByAirship.mockResolvedValueOnce(lastFlight)

        await expect(saveFlight.execute(flightData)).rejects.toThrow(InsufficientFuelError)  
    })


    test("Não deve atualizar a capacidade da aeronave", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 80, 1) 
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");
        const routeMock = new Route(1, 2, 10)
        const lastFlight = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)

        flightData.startAt = new Date('2023-04-29 14:00:00') // setando uma data um dia após da data de chegada do ultimo voo
        flightData.arrivalAt = new Date('2023-05-01 14:00:00')

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)
        mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(routeMock)
        mockFlightRepository.getLastFlightByAirship.mockResolvedValueOnce(lastFlight)

        await expect(saveFlight.execute(flightData)).resolves.toBeUndefined();

        const finalCapacity = airshipMock.getCurrentCapacity() - routeMock.getExpense()
        expect(mockFlightRepository.save).toHaveBeenCalledWith({
            startAt: flightData.startAt,
            arrivalAt: flightData.arrivalAt,
            originPlanetId: aviatorMock.gePlanetId(),
            destinationPlanetId: planetMock.getId(),
            airshipId: airshipMock.getId(),
            initialCapacity: airshipMock.getCurrentCapacity(),
            finalCapacity: finalCapacity,
        })

        expect(mockAirshipRepository.updateCurrentCapacity).toHaveBeenCalledWith(airshipMock.getId(), finalCapacity)
        expect(mockAirshipRepository.updateCurrentCapacity).toHaveBeenCalledWith(airshipMock.getId(), finalCapacity)
    })

    test("Deve atualizar a capacidade da aeronave se a capacidade atual estiver 0 e o novo voo for no outro dia", async () => {
        const airshipMock = new Airship(1, 'model', 2023, 100, 0, 1) // Capacidade zerada
        const aviatorMock = new Aviator(1, "John Doe", 123456, 1, "Earth");
        const planetMock = new Planet(1, "Earth");
        const routeMock = new Route(1, 2, 10)
        const lastFlight = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)

        flightData.startAt = new Date('2023-04-29 14:00:00') // setando uma data um dia após da data de chegada do ultimo voo
        flightData.arrivalAt = new Date('2023-05-01 14:00:00')

        mockAirshipRepository.findById.mockResolvedValue(airshipMock);
        mockAviatorRepository.findById.mockResolvedValue(aviatorMock)
        mockPlanetRepository.getByName.mockResolvedValue(planetMock)
        mockRoutesRepository.getByOriginAndDestination.mockResolvedValue(routeMock)
        mockFlightRepository.getLastFlightByAirship.mockResolvedValueOnce(lastFlight)

        await expect(saveFlight.execute(flightData)).resolves.toBeUndefined();

        const finalCapacity = airshipMock.getFuelCapacity() - routeMock.getExpense()
        expect(mockFlightRepository.save).toHaveBeenCalledWith({
            startAt: flightData.startAt,
            arrivalAt: flightData.arrivalAt,
            originPlanetId: aviatorMock.gePlanetId(),
            destinationPlanetId: planetMock.getId(),
            airshipId: airshipMock.getId(),
            initialCapacity: airshipMock.getFuelCapacity(),
            finalCapacity: finalCapacity,
        })

        expect(mockAirshipRepository.updateCurrentCapacity).toHaveBeenCalledWith(airshipMock.getId(), finalCapacity)
        expect(mockAirshipRepository.updateCurrentCapacity).toHaveBeenCalledWith(airshipMock.getId(), finalCapacity)
    })

})