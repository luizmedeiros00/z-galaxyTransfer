import Aviator from "../../domain/entity/aviator/Aviator"
import AviatorDataRepository from "../../domain/entity/aviator/AviatorDataRepository";

export default interface AviatorRepository {
    save(aviator: AviatorDataRepository): Promise<void>;
    findByFlyCardNumber(flyCardNumber: number): Promise<Aviator | null>;
    findById(id: number): Promise<Aviator | null>;
    updatePlanet(id: number, planetId: number): Promise<void>;
}