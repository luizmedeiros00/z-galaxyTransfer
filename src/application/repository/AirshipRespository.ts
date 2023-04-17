import Airship from "../../domain/entity/airship/Airship"
import AirshipDataRepository from "../../domain/entity/airship/AirshipDataRepository"

export default interface AirshipRespository {
    save(data: AirshipDataRepository): Promise<void>
    findById(id: number): Promise<Airship | null>
    updateCurrentCapacity(id: number, capacity: number): Promise<void>
    getAirshipsByAviatorId(aviatorId: number): Promise<Airship[] | null>
}