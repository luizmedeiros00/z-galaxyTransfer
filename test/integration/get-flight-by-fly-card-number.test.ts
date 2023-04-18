import FlightRepository from "../../src/application/repository/FlightRepository";
import AviatorRepository from "../../src/application/repository/AviatorRepository";
import GetFlightByFlyCardNumber from "../../src/application/service/GetFlightByFlyCardNumber";
import AviatorNotFoundError from "../../src/application/exceptions/AviatorNotFoundError";
import Aviator from "../../src/domain/entity/aviator/Aviator";
import Flight from "../../src/domain/entity/flights/Flight";

jest.mock("../../src/application/repository/FlightRepository");
jest.mock("../../src/application/repository/AirshipRespository");

describe("GetFlightByFlyCardNumber", () => {
  let mockFlightRepository: jest.Mocked<FlightRepository>;
  let mockAviatorRepository: jest.Mocked<AviatorRepository>;
  let getFlightByFlyCardNumber: GetFlightByFlyCardNumber;

  beforeEach(() => {
    mockFlightRepository = {
      save: jest.fn(),
      getLastFlightByAirship: jest.fn(),
      getByAviatorId: jest.fn(),
    };

    mockAviatorRepository = {
      findByFlyCardNumber: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      updatePlanet: jest.fn(),
    };

    getFlightByFlyCardNumber = new GetFlightByFlyCardNumber(
      mockAviatorRepository,
      mockFlightRepository
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Deve lançar o erro AviatorNotFoundError caso o piloto não seja encontrado com o flyCard fornecido", async () => {
    const flyCardNumber = 1234;
    mockAviatorRepository.findByFlyCardNumber.mockResolvedValue(null);
    expect(getFlightByFlyCardNumber.execute(flyCardNumber)).rejects.toThrow(
      AviatorNotFoundError
    );
  });

  test("Deve retornar os voos", async () => {
    const aviator = new Aviator(1, "luiz", 2, 1, "planeta");
    mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(aviator);
    const flight1 = new Flight(1, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)
    const flight2 = new Flight(2, new Date('2023-04-17 12:00:00'), new Date('2023-04-20 15:00:00'), 'destinationPlanet', 'originPlanet', 1, 'aisrshipModel', 100, 50)
   
    mockFlightRepository.getByAviatorId.mockResolvedValue([flight1, flight2])
    const result = await getFlightByFlyCardNumber.execute(aviator.getFlyCardNumber())
    
    expect(result).toEqual([flight1, flight2])
    expect(mockAviatorRepository.findByFlyCardNumber).toHaveBeenCalledWith(aviator.getFlyCardNumber())
    expect(mockFlightRepository.getByAviatorId).toHaveBeenCalledWith(aviator.getId())
  });
});
