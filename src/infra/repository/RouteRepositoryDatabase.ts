import PlanetNotFoundError from "../../application/exceptions/PlanetNotFoundError";
import PlanetRepository from "../../application/repository/PlanetRepository";
import RoutesRepository from "../../application/repository/RoutesRepository";
import Route from "../../domain/entity/route/Route";
import Connection from "../database/Connection";

export default class RouteRepositoryDatabase implements RoutesRepository {

    constructor(
        readonly connection: Connection,
    ) {

    }

    async getByOriginAndDestination(origin: number, destination: number): Promise<Route | null> {

        const query = `select * from routes where origin_planet = $1 and destination_planet = $2`;
        const result = await this.connection.one(query, [origin, destination]);
        if(!result) {
            return null;
        }
        return new Route(result.origin_planet, result.destination_planet, result.expense);
    }
    
}