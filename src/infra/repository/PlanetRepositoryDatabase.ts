import PlanetRepository from "../../application/repository/PlanetRepository";
import Planet from "../../domain/entity/Planet";
import Connection from "../database/Connection";

export default class PlanetRepositoryDatabase implements PlanetRepository {
    constructor(
        readonly connection: Connection
    ) { }

    async getByName(name: string): Promise<Planet | null> {
        const query = `select * from planets where name = $1`;
        const result = await this.connection.one(query, [name]);
        if(!result) {
            return null
        }
        return new Planet(result.id, result.name)
    }

}