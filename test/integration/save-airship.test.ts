import AviatorNotFoundError from "../../src/application/exceptions/AviatorNotFoundError"
import AirshipRespository from "../../src/application/repository/AirshipRespository"
import AviatorRepository from "../../src/application/repository/AviatorRepository"
import SaveAirship from "../../src/application/service/SaveAirship"
import AirshiptData from "../../src/domain/entity/airship/AirshipData"
import Aviator from "../../src/domain/entity/aviator/Aviator"

jest.mock("../../src/application/repository/AviatorRepository");
jest.mock("../../src/application/repository/AirshipRespository");

describe("SaveAirship", () => {
    let saveAirship: SaveAirship
    let mockAviatorRepository: jest.Mocked<AviatorRepository>
    let mockAirshipRepository: jest.Mocked<AirshipRespository>

    beforeEach(() => {
        mockAviatorRepository = {
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
        } as jest.Mocked<AirshipRespository>;

        saveAirship = new SaveAirship(mockAirshipRepository, mockAviatorRepository);
    });

    const airshipData: AirshiptData = {
        model: 'Model Airship',
        yearManufacture: 2023,
        fuelCapacity: 100,
        flyCardNumberAviator: 2
    };

    test("Deve salvar a aeronave", async () => {
        const aviator = new Aviator(1, 'luiz', 2, 1, 'planeta')
        mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(aviator)
        await expect(saveAirship.execute(airshipData)).resolves.toBeUndefined();
        expect(mockAviatorRepository.findByFlyCardNumber).toHaveBeenCalledWith(
            2
        );

        expect(mockAirshipRepository.save).toHaveBeenCalledWith({
            model: "Model Airship",
            yearManufacture: 2023,
            fuelCapacity: 100,
            currentCapacity: 100,
            aviatorId: 1
        });
    })

    test("Deve recever o erro AviatorNotFoundError se o piloto não for encontrado", async () => {
        mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(null)
        await expect(saveAirship.execute(airshipData)).rejects.toThrow(
            new AviatorNotFoundError()
        );
    })
})