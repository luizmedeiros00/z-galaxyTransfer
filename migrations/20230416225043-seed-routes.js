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
  db.runSql(`
  INSERT INTO public.routes
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
  `, callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
