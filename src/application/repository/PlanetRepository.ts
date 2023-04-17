import Planet from "../../domain/entity/Planet";

export default interface PlanetRepository {
  getByName(name: string): Promise<Planet | null >
}