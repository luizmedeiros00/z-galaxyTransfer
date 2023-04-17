import Route from "../../domain/entity/route/Route";

export default interface RoutesRepository {
    getByOriginAndDestination(origin: number, destination: number): Promise<Route | null>
}