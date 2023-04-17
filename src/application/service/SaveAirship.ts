import AirshiptData from "../../domain/entity/airship/AirshipData";
import AviatorNotFoundError from "../exceptions/AviatorNotFoundError";
import AirshipRespository from "../repository/AirshipRespository";
import AviatorRepository from "../repository/AviatorRepository";

export default class SaveAirship {
    constructor(
        readonly airshipRepository: AirshipRespository,
        readonly aviatorRepository: AviatorRepository
    ) { }

    async execute(airshipData: AirshiptData): Promise<void> {
        const aviator = await this.aviatorRepository.findByFlyCardNumber(airshipData.flyCardNumberAviator);
        if (!aviator) {
            throw new AviatorNotFoundError();
        }

        const dataRepository = {
            model: airshipData.model,
            yearManufacture: airshipData.yearManufacture,
            fuelCapacity: airshipData.fuelCapacity,
            currentCapacity: airshipData.fuelCapacity,
            aviatorId: aviator.getId()
        }

        await this.airshipRepository.save(dataRepository)
    }
}