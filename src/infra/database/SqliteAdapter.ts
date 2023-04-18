import sqlite3, {Database} from "sqlite3";
import Connection from "./Connection";

export default class SQLiteConnection implements Connection {
  private db!: Database;

  constructor(private readonly filename: string) {}

  async connect(): Promise<void> {
    this.db = new sqlite3.Database(this.filename);
  }

  async query(statement: string, params: any): Promise<any> {
    await this.connect();
    return new Promise((resolve, reject) => {
      this.db.all(statement, params, function (err, row) {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async one(query: string, values?: any[]): Promise<any> {
    await this.connect();
    return new Promise((resolve, reject) => {
      this.db.get(query, values, function (err, row) {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async close(): Promise<void> {
    this.db.close();
  }
}