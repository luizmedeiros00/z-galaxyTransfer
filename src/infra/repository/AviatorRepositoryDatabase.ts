
import PlanetNotFoundError from "../../application/exceptions/PlanetNotFoundError";
import AviatorRepository from "../../application/repository/AviatorRepository";
import PlanetRepository from "../../application/repository/PlanetRepository";
import Aviator from "../../domain/entity/aviator/Aviator";
import AviatorData from "../../domain/entity/aviator/AviatorData";
import AviatorDataRepository from "../../domain/entity/aviator/AviatorDataRepository";
import Connection from "../database/Connection";

export default class AviatorRepositoryDatabase implements AviatorRepository {

    constructor(
        readonly connection: Connection,
    ) { }

    async updatePlanet(id: number, planetId: number): Promise<void> {
        const query = `
        UPDATE aviator set planet_id = $1 where id = $2
        `;

        await this.connection.query(query, [
            planetId,
            id
        ]);
    }

    async findById(id: number): Promise<Aviator | null> {
        const query = `select aviator.*, planets.name as current_planet from aviator as aviator
        join planets as planets on aviator.planet_id = planets.id
        where aviator.id = $1`;
        const result = await this.connection.one(query, [id]);
        if (!result) {
            return null
        }
        return new Aviator(result.id, result.name, result.flycard_number, result.planet_id, result.current_planet)
    }

    async findByFlyCardNumber(flyCardNumber: number): Promise<Aviator | null> {
        const query = `select aviator.*, planets.name as current_planet from aviator as aviator
        join planets as planets on aviator.planet_id = planets.id
        where flycard_number = $1`;
        const result = await this.connection.one(query, [flyCardNumber]);
        if (!result) {
            return null
        }
        return new Aviator(result.id, result.name, result.flycard_number, result.planet_id, result.current_planet)
    }

    async save(aviator: AviatorDataRepository): Promise<void> {
        const query = `
                INSERT INTO aviator (name, flycard_number, planet_id) 
                VALUES ($1, $2, $3)
                `;
        await this.connection.query(query, [
            aviator.name,
            aviator.flyCardNumber,
            aviator.currentPlanetId
        ]);
    }
}