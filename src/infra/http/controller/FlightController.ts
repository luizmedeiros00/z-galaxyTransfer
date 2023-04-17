import { Request, Response } from 'express';
import GetFlightByFlyCardNumber from '../../../application/service/GetFlightByFlyCardNumber';
import SaveFlight from "../../../application/service/SaveFlight";

export default class FlightController {
    constructor(
        readonly saveFlight: SaveFlight,
        readonly getFlightByFlyCardNumber: GetFlightByFlyCardNumber
    ) {
    }

    async save(req: Request, res: Response): Promise<void> {
        try {
            const {
                startAt,
                arrivalAt,
                destinationPlanet,
                airshipId,
            } = req.body;

            await this.saveFlight.execute({
                startAt: new Date(startAt),
                arrivalAt: new Date(arrivalAt),
                destinationPlanet,
                airshipId,
            })

            res.status(201).send('Voo cadastrado com sucesso');
        } catch (error: unknown) {
            res.status(400).send((error as Error).message);
        }
    }

    async get(req: Request, res: Response): Promise<void> {
        try {
            const {
                flyCardNumber
            } = req.params;

            const response = await this.getFlightByFlyCardNumber.execute(parseInt(flyCardNumber))

            res.status(201).json(response);
        } catch (error: unknown) {
            res.status(400).send((error as Error).message);
        }
    }
}