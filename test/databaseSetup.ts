import Connection from "../src/infra/database/Connection";

export async function downDatabase(connection: Connection): Promise<void> {
  await connection.query('DROP TABLE planets;',[]);
  await connection.query('DROP TABLE aviator;',[]);
  await connection.query('DROP TABLE airships;',[]);
  await connection.query('DROP TABLE flights;',[]);
  await connection.query('DROP TABLE routes;',[]);
}

export async function setupDatabase(connection: Connection): Promise<void> {
  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS planets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name string
    )
  `,
    []
  );

  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS aviator (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255),
      flycard_number INTEGER,
      planet_id INTERGER,
      FOREIGN KEY (planet_id) REFERENCES planets(id) 
      ON DELETE CASCADE ON UPDATE RESTRICT
    )
  `,
    []
  );

  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS airships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      year_manufacture INTEGER NOT NULL,
      fuel_capacity REAL NOT NULL,
      current_capacity REAL NOT NULL,
      aviator_id INTEGER NOT NULL,
      FOREIGN KEY (aviator_id) REFERENCES aviator(id) 
      ON DELETE CASCADE ON UPDATE RESTRICT
    )
  `,
    []
  );

  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_at TIMESTAMP,
      arrival_at TIMESTAMP,
      initial_capacity INTEGER,
      final_capacity INTEGER,
      destination_planet INTEGER,
      origin_planet INTEGER,
      airship_id INTEGER,
      FOREIGN KEY (destination_planet) REFERENCES planets(id) ON DELETE CASCADE ON UPDATE RESTRICT,
      FOREIGN KEY (origin_planet) REFERENCES planets(id) ON DELETE CASCADE ON UPDATE RESTRICT,
      FOREIGN KEY (airship_id) REFERENCES airships(id) ON DELETE CASCADE ON UPDATE RESTRICT
      );
  `,
    []
  );

  await connection.query(
    `
    INSERT INTO planets ("name") 
    VALUES ('Meraki'),('Kefir'), ('Azura'), ('Virago'), ('Kalon')
  `,
    []
  );

  await connection.query(
    `
    CREATE TABLE IF NOT EXISTS routes (
      destination_planet INTEGER,
      origin_planet INTEGER,
      expense INTEGER,
      FOREIGN KEY (destination_planet) REFERENCES planets(id) ON DELETE CASCADE ON UPDATE RESTRICT,
      FOREIGN KEY (origin_planet) REFERENCES planets(id) ON DELETE CASCADE ON UPDATE RESTRICT
      );
  `,
    []
  );


  await connection.query(
    `
    INSERT INTO routes
    (origin_planet, destination_planet, expense)
  VALUES
    (1, 1, 0),
    (1, 2, 5),
    (1, 3, 10),
    (1, 4, 70),
    (1, 5, 55),
    (2, 1, 5),
    (2, 2, 0),
    (2, 3, 7),
    (2, 4, 90),
    (2, 5, 35),
    (3, 1, 10),
    (3, 2, 7),
    (3, 3, 0),
    (3, 4, 20),
    (3, 5, 40),
    (4, 1, 70),
    (4, 2, 90),
    (4, 3, 20),
    (4, 4, 0),
    (4, 5, 10),
    (5, 1, 55),
    (5, 2, 35),
    (5, 3, 40),
    (5, 4, 10),
    (5, 5, 0);
  `,
    []
  );
}
