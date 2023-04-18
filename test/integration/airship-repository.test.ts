import Airship from "../../src/domain/entity/airship/Airship";
import Connection from "../../src/infra/database/Connection";
import SQLiteConnection from "../../src/infra/database/SqliteAdapter";
import AirshipRespositoryDatabase from "../../src/infra/repository/AirshipRespositoryDatabase";
import AviatorRepositoryDatabase from "../../src/infra/repository/AviatorRepositoryDatabase";
import { setupDatabase, downDatabase } from "../databaseSetup";

describe("AirshipRespositoryDatabase", () => {
  let connection = new SQLiteConnection("test/database.sqlite")
  let aviatorRepository = new AviatorRepositoryDatabase(connection)
  let airshipRepository = new AirshipRespositoryDatabase(connection)

  beforeEach(async () => {
    await setupDatabase(connection);
  });

  afterEach(async () => {
    // await downDatabase(connection);
  });

  test("deve salvar a aeronave", async () => {
    // const aviatorData = { name: "luiz", flyCardNumber: 2, currentPlanetId: 1 };
    // await aviatorRepository.save(aviatorData)

    // const airshipData = {
    //   model: 'Model 3',
    //   yearManufacture: 2022,
    //   fuelCapacity: 100,
    //   currentCapacity: 100,
    //   aviatorId: 100
    // };

    // await airshipRepository.save(airshipData)
    // const airships = await airshipRepository.getAirshipsByAviatorId(1);
    // console.log(airships)
    // expect(airships).toHaveLength(1);
  });
});
