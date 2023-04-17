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
  db.createTable('aviator', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string',
    flycard_number: 'int',
    planet_id: {
      type: 'int',
      foreignKey: {
        name: 'aviator_planet_id_fk',
        table: 'planets',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('aviator', function(err) {
    if (err) return callback(err);
    return callback();
  });
};
exports._meta = {
  "version": 1
};
