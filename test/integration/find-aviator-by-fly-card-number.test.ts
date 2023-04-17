import AirshipRespository from "../../src/application/repository/AirshipRespository";
import AviatorRepository from "../../src/application/repository/AviatorRepository";
import FindAviatorByFlyCardNumber from "../../src/application/service/FindAviatorByFlyCardNumber";
import Aviator from "../../src/domain/entity/aviator/Aviator";
import Airship from "../../src/domain/entity/airship/Airship";
import AviatorNotFoundError from "../../src/application/exceptions/AviatorNotFoundError";

jest.mock("../../src/application/repository/AviatorRepository");
jest.mock("../../src/application/repository/AirshipRespository");

describe("FindAviatorByFlyCardNumber", () => {
    let mockedAviatorRepository: jest.Mocked<AviatorRepository>;
    let mockAirshipRepository: jest.Mocked<AirshipRespository>;
    let findAviatorByFlyCardNumber: FindAviatorByFlyCardNumber;

    beforeEach(() => {
        mockedAviatorRepository = {
            findByFlyCardNumber: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            updatePlanet: jest.fn()
        } as jest.Mocked<AviatorRepository>;
        mockAirshipRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            updateCurrentCapacity: jest.fn(),
            getAirshipsByAviatorId: jest.fn()
        } as jest.Mocked<AirshipRespository>;;

        findAviatorByFlyCardNumber = new FindAviatorByFlyCardNumber(
            mockedAviatorRepository,
            mockAirshipRepository
        );
    });

    it("should return the aviator with the given fly card number", async () => {
        const aviator = new Aviator(1, 'luiz', 2, 1, 'planeta')
        mockedAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(aviator);

        const airship = new Airship(1, 'model airship', 2023, 100, 100, 1);
        mockAirshipRepository.getAirshipsByAviatorId.mockResolvedValueOnce([airship]);

        const result = await findAviatorByFlyCardNumber.execute(2);

        expect(result).toBeInstanceOf(Aviator);
        expect(result.name).toBe("luiz");
        expect(result.flyCardNumber).toBe(2);
        expect(result.getAirships()).toHaveLength(1);
    });

    it("Deve receber AviatorNotFoundError se o piloto não for encontrado", async () => {
        mockedAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(null);
        await expect(findAviatorByFlyCardNumber.execute(12345)).rejects.toThrow(
            AviatorNotFoundError
        );
    });
});