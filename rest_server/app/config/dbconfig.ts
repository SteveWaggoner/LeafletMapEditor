/* Load modules */
import sqlite3 = require('sqlite3');

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
const db = new sqlite3.Database('./db/sqlite.db');

/* Init label table if they don't exist */
const init = function () {
    db.run("CREATE TABLE if not exists label (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        " text TEXT NOT NULL," +
        " x DOUBLE NOT NULL," +
        " y DOUBLE NOT NULL" +
        ")");

};

export default {db:db, init:init}
 
