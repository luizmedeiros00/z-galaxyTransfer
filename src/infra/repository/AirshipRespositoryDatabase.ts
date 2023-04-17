
import AirshipRespository from "../../application/repository/AirshipRespository";
import Airship from "../../domain/entity/airship/Airship";
import AirshipDataRepository from "../../domain/entity/airship/AirshipDataRepository";
import Connection from "../database/Connection";

export default class AirshipRespositoryDatabase implements AirshipRespository {

    constructor(
        readonly connection: Connection,
    ) { }

    async updateCurrentCapacity(id: number, capacity: number): Promise<void> {
        const query = `
        UPDATE airships set current_capacity = $1 where id = $2
        `;

        await this.connection.query(query, [
            capacity,
            id
        ]);
    }

    async save(airshipData: AirshipDataRepository): Promise<void> {
        const query = `
        INSERT INTO airships (model, year_manufacture, fuel_capacity, current_capacity, aviator_id) 
        VALUES ($1, $2, $3, $4, $5)
        `;
        await this.connection.query(query, [
            airshipData.model,
            airshipData.yearManufacture,
            airshipData.fuelCapacity,
            airshipData.currentCapacity,
            airshipData.aviatorId
        ]);
    }

    async findById(id: number): Promise<Airship | null> {
        const query = `select * from airships where id = $1`;
        const result = await this.connection.one(query, [id]);
        if (!result) {
            return null
        }
        return new Airship(
            result.id,
            result.model,
            result.year_manufacture,
            result.fuel_capacity,
            result.current_capacity,
            result.aviator_id
        )
    }

    async getAirshipsByAviatorId(aviatorId: number): Promise<Airship[] | null> {
        const query = `select * from airships where aviator_id = $1`;
        const result = await this.connection.query(query, [aviatorId]);
        if (!result) {
            return null
        }
        const airships = []
        for (const airshipResult of result) {
            airships.push(new Airship(
                airshipResult.id,
                airshipResult.model,
                airshipResult.year_manufacture,
                airshipResult.fuel_capacity,
                airshipResult.current_capacity,
                airshipResult.aviator_id
            ))
        }

        return airships

    }


}