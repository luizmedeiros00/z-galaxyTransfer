import AviatorRepository from "../repository/AviatorRepository";
import AviatorNotFoundError from "../exceptions/AviatorNotFoundError";
import Aviator from "../../domain/entity/aviator/Aviator";
import AirshipRespository from "../repository/AirshipRespository";

export default class FindAviatorByFlyCardNumber {
    constructor(
        readonly aviatorRepository: AviatorRepository,
        readonly airshipRepository: AirshipRespository
    ) { }

    async execute(flyCardNumber: number): Promise<Aviator> {
        const aviator = await this.aviatorRepository.findByFlyCardNumber(flyCardNumber);
        if (!aviator) {
            throw new AviatorNotFoundError()
        }
     
        const ariships = await this.airshipRepository.getAirshipsByAviatorId(aviator.id)
        if(ariships) {
            for(const airship of ariships) {
                aviator.addAirship(airship)
            }
        }

        return aviator;
    }
}