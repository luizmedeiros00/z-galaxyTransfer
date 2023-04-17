'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('flights', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    start_at: 'timestamp',
    arrival_at: 'timestamp',
    initial_capacity: 'int',
    final_capacity: 'int',
    destination_planet: {
      type: 'int',
      foreignKey: {
        name: 'flight_destination_id_fk',
        table: 'planets',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    origin_planet: {
      type: 'int',
      foreignKey: {
        name: 'flight_origin_id_fk',
        table: 'planets',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    airship_id: {
      type: 'int',
      foreignKey: {
        name: 'flight_airship_id_fk',
        table: 'airships',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('flights', function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports._meta = {
  "version": 1
};
