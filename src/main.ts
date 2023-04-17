import express, { Request, Response } from "express";
import cors from "cors";

const app = express()
app.use(express.json());
app.use(cors());

import PostgresqlAdapter from "./infra/database/PostgresqlAdapter"
import PlanetRepositoryDatabase from "./infra/repository/PlanetRepositoryDatabase"

import AviatorRepositoryDatabase from "./infra/repository/AviatorRepositoryDatabase"
import SaveAviator from "./application/service/SaveAviator"
import AviatorController from "./infra/http/controller/AviatorController"

import AirshipRespositoryDatabase from "./infra/repository/AirshipRespositoryDatabase"
import SaveAirship from "./application/service/SaveAirship"
import AirshipController from "./infra/http/controller/AirshipController"

import FlightRepositoryDatabase from "./infra/repository/FlightRepositoryDatabase";
import SaveFlight from "./application/service/SaveFlight";
import FlightController from "./infra/http/controller/FlightController";
import RouteRepositoryDatabase from "./infra/repository/RouteRepositoryDatabase";
import FindAviatorByFlyCardNumber from "./application/service/FindAviatorByFlyCardNumber";
import GetFlightByFlyCardNumber from "./application/service/GetFlightByFlyCardNumber";

const connection = new PostgresqlAdapter()

const planetRepository = new PlanetRepositoryDatabase(connection)
const routeRepository = new RouteRepositoryDatabase(connection)
const airshipRepository = new AirshipRespositoryDatabase(connection)

const aviatorRepository = new AviatorRepositoryDatabase(connection)
const saveAviator = new SaveAviator(aviatorRepository, planetRepository)
const findAviatorByFlyCardNumber = new FindAviatorByFlyCardNumber(aviatorRepository, airshipRepository)

const saveAirship = new SaveAirship(airshipRepository, aviatorRepository)

const flightRepository = new FlightRepositoryDatabase(connection)
const saveFlight = new SaveFlight(flightRepository, airshipRepository, routeRepository, aviatorRepository, planetRepository)
const getFlightsByFlyCardNumber = new GetFlightByFlyCardNumber(aviatorRepository, flightRepository)

const aviatorController = new AviatorController(saveAviator, findAviatorByFlyCardNumber)
const airshipController = new AirshipController(saveAirship)
const flightController = new FlightController(saveFlight, getFlightsByFlyCardNumber)

app.get('/aviators/:flyCardNumber', async (request: Request, response: Response) => {
  await aviatorController.getByFlyCardNumber(request, response);
});

app.post('/aviators', async (request: Request, response: Response) => {
  await aviatorController.save(request, response);
});

app.post('/airships', async (request: Request, response: Response) => {
  await airshipController.save(request, response);
});

app.get('/flights/:flyCardNumber', async (request: Request, response: Response) => {
  await flightController.get(request, response);
});

app.post('/flights', async (request: Request, response: Response) => {
  await flightController.save(request, response);
});

app.listen(3000)