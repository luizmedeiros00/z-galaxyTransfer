import SaveAviator from "../../src/application/service/SaveAviator";
import AviatorData from "../../src/domain/entity/aviator/AviatorData";
import AviatorRepository from "../../src/application/repository/AviatorRepository";
import PlanetRepository from "../../src/application/repository/PlanetRepository";
import InvalidFlyCardNumberError from "../../src/application/exceptions/InvalidFlyCardNumberError";
import AviatorAlreadyExistsError from "../../src/application/exceptions/AviatorAlreadyExistsError";
import PlanetNotFoundError from "../../src/application/exceptions/PlanetNotFoundError";


describe('SaveAvitor', () => {
    let saveAviator: SaveAviator;
    let mockAviatorRepository: AviatorRepository;
    let mockPlanetRepository: PlanetRepository

    beforeEach(() => {
        mockAviatorRepository = {
            findByFlyCardNumber: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            updatePlanet: jest.fn()
        };
        mockPlanetRepository = {
            getByName: jest.fn()
        };
        saveAviator = new SaveAviator(mockAviatorRepository, mockPlanetRepository);
    });

    const aviatorData: AviatorData = {
        name: "John Smith",
        flyCardNumber: 2,
        currentPlanet: "Meraki"
    };

    test("Deve salvar o pito", async () => {
        (mockAviatorRepository.findByFlyCardNumber as jest.Mock).mockResolvedValueOnce(null);
        (mockPlanetRepository.getByName as jest.Mock).mockResolvedValueOnce({ getId: () => 1 });

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

        (mockAviatorRepository.findByFlyCardNumber as jest.Mock).mockResolvedValueOnce(null);

        await expect(
            saveAviator.execute(aviatorDataWithInvalidFlyCardNumber)
        ).rejects.toThrow(new InvalidFlyCardNumberError(invalidFlyCardNumber));
    });

    test('Deve receber o erro AviatorAlreadyExistsError se o piloto ja existir', async () => {
        (mockAviatorRepository.findByFlyCardNumber as jest.Mock).mockResolvedValueOnce({
            flyCardNumber: aviatorData.flyCardNumber,
        });

        await expect(saveAviator.execute(aviatorData)).rejects.toThrow(
            new AviatorAlreadyExistsError(aviatorData.flyCardNumber)
        );
    });

    test('Deve receber o erro PlanetNotFoundError se o planeta não existir', async () => {
        (mockPlanetRepository.getByName as jest.Mock).mockResolvedValueOnce(null);

        await expect(saveAviator.execute(aviatorData)).rejects.toThrow(
          new PlanetNotFoundError(aviatorData.currentPlanet)
        );
    });
})