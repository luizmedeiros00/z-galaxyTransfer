import Connection from "./Connection";
import pgp from "pg-promise";

export default class PostgresqlAdapter implements Connection {
	connection: any;

	constructor () {
		this.connection = pgp()("postgres://pgsql:pgsql@localhost:5432/will_db");
	}

	async one(query: string, values?: any[] | undefined): Promise<any> {
		return this.connection.oneOrNone(query, values);
	}

	async query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	async close(): Promise<void> {
		await this.connection.$pool.end();
	}

}