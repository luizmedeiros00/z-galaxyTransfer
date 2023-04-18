import { Request, Response } from 'express';
import FindAviatorByFlyCardNumber from '../../../application/service/FindAviatorByFlyCardNumber';
import SaveAviator from "../../../application/service/SaveAviator";
import { validationResult } from "express-validator";
export default class AviatorController {
    constructor(
        readonly saveAviator: SaveAviator,
        readonly findAviatorByFlyCardNumber: FindAviatorByFlyCardNumber
    ) { }

    async save(req: Request, res: Response): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
          return;
        }

        try {
            const { name, flyCardNumber, currentPlanet } = req.body;

            await this.saveAviator.execute({
                name,
                flyCardNumber,
                currentPlanet
            })

            res.status(201).send('Piloto cadastrado com sucesso');
        } catch (error: unknown) {
            res.status(400).send((error as Error).message);
        }
    }

    async getByFlyCardNumber(req: Request, res: Response): Promise<void> {
        try {
            const { flyCardNumber } = req.params

            const response = await this.findAviatorByFlyCardNumber.execute(parseInt(flyCardNumber))

            res.status(201).json(response);
        } catch (error: unknown) {
            res.status(400).send((error as Error).message);
        }
    }
}