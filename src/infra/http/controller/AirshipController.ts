import SaveAirship from "../../../application/service/SaveAirship";
import { Request, Response } from 'express';

export default class AirshipController {
    constructor(
        readonly saveAirship: SaveAirship
    ) {
    }

    async save(req: Request, res: Response): Promise<void> {
        try {
            const {
                model,
                yearManufacture,
                fuelCapacity,
                flyCardNumberAviator
            } = req.body;

            await this.saveAirship.execute({
                model,
                yearManufacture,
                fuelCapacity,
                flyCardNumberAviator
            })

            res.status(201).send('Aeronave cadastrada com sucesso');
        } catch (error: unknown) {
            res.status(400).send((error as Error).message);
        }
    }
}