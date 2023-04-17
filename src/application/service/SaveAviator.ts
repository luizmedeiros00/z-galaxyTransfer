import AviatorData from "../../domain/entity/aviator/AviatorData";
import AviatorRepository from "../repository/AviatorRepository";
import AviatorAlreadyExistsError from '../exceptions/AviatorAlreadyExistsError'
import AviatorValidator from "../validators/AviatorValidator";
import InvalidFlyCardNumberError from "../exceptions/InvalidFlyCardNumberError";
import PlanetRepository from "../repository/PlanetRepository";
import PlanetNotFoundError from "../exceptions/PlanetNotFoundError";

export default class SaveAviator {
  constructor(
    readonly aviatorRepository: AviatorRepository,
    readonly planetRepository: PlanetRepository
  ) { }

  async execute(aviator: AviatorData): Promise<void> {

    if (!AviatorValidator.validateFlyCardNumber(aviator.flyCardNumber)) {
      throw new InvalidFlyCardNumberError(aviator.flyCardNumber)
    }

    const existingAviator = await this.aviatorRepository.findByFlyCardNumber(
      aviator.flyCardNumber
    );

    if (existingAviator) {
      throw new AviatorAlreadyExistsError(aviator.flyCardNumber)
    }

    const planet = await this.planetRepository.getByName(aviator.currentPlanet);
    if (!planet) {
      throw new PlanetNotFoundError(aviator.currentPlanet);
    }

    const dataRepository = {
      name: aviator.name,
      flyCardNumber: aviator.flyCardNumber,
      currentPlanetId: planet.getId()
    }

    await this.aviatorRepository.save(dataRepository);
  }
}