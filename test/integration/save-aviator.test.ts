import SaveAviator from "../../src/application/service/SaveAviator";
import AviatorData from "../../src/domain/entity/aviator/AviatorData";
import AviatorRepository from "../../src/application/repository/AviatorRepository";
import PlanetRepository from "../../src/application/repository/PlanetRepository";
import InvalidFlyCardNumberError from "../../src/application/exceptions/InvalidFlyCardNumberError";
import AviatorAlreadyExistsError from "../../src/application/exceptions/AviatorAlreadyExistsError";
import PlanetNotFoundError from "../../src/application/exceptions/PlanetNotFoundError";
import Planet from "../../src/domain/entity/Planet";
import Aviator from "../../src/domain/entity/aviator/Aviator";

jest.mock("../../src/application/repository/AviatorRepository");
jest.mock("../../src/application/repository/PlanetRepository");

describe('SaveAvitor', () => {
    let saveAviator: SaveAviator;
    let mockAviatorRepository: jest.Mocked<AviatorRepository>;
    let mockPlanetRepository: jest.Mocked<PlanetRepository>

    beforeEach(() => {
        mockAviatorRepository = {
            findByFlyCardNumber: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            updatePlanet: jest.fn()
        } as jest.Mocked<AviatorRepository>;
        mockPlanetRepository = {
            getByName: jest.fn()
        } as jest.Mocked<PlanetRepository>;
        saveAviator = new SaveAviator(mockAviatorRepository, mockPlanetRepository);
    });

    const aviatorData: AviatorData = {
        name: "John Smith",
        flyCardNumber: 2,
        currentPlanet: "Meraki"
    };

    test("Deve salvar o pito", async () => {
        const planet = new Planet(1, 'PlanetName')
        mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(null);
        mockPlanetRepository.getByName.mockResolvedValueOnce(planet);

        await expect(saveAviator.execute(aviatorData)).resolves.toBeUndefined();
        expect(mockAviatorRepository.findByFlyCardNumber).toHaveBeenCalledWith(
            2
        );
        expect(mockPlanetRepository.getByName).toHaveBeenCalledWith("Meraki");
        expect(mockAviatorRepository.save).toHaveBeenCalledWith({
            name: "John Smith",
            flyCardNumber: 2,
            currentPlanetId: 1
        });
    })

    test('Deve receber o erro InvalidFlyCardNumberError se o fly card number for inválido', async () => {
        const invalidFlyCardNumber = 1;
        const aviatorDataWithInvalidFlyCardNumber: AviatorData = {
            ...aviatorData,
            flyCardNumber: invalidFlyCardNumber,
        };

        mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(null);

        await expect(
            saveAviator.execute(aviatorDataWithInvalidFlyCardNumber)
        ).rejects.toThrow(new InvalidFlyCardNumberError(invalidFlyCardNumber));
    });

    test('Deve receber o erro AviatorAlreadyExistsError se o piloto ja existir', async () => {
        const aviator = new Aviator(1, 'luiz', 2, 1, 'planet');
        mockAviatorRepository.findByFlyCardNumber.mockResolvedValueOnce(aviator);

        await expect(saveAviator.execute(aviatorData)).rejects.toThrow(
            new AviatorAlreadyExistsError(aviatorData.flyCardNumber)
        );
    });

    test('Deve receber o erro PlanetNotFoundError se o planeta não existir', async () => {
        mockPlanetRepository.getByName.mockResolvedValueOnce(null);

        await expect(saveAviator.execute(aviatorData)).rejects.toThrow(
          new PlanetNotFoundError(aviatorData.currentPlanet)
        );
    });
})