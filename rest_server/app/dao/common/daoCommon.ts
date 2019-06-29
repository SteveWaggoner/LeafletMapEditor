import database from '../../config/dbconfig';
import { Promise } from 'bluebird';
import { DaoError } from './daoError';

/**
 * DAOs Common functions
 */
export
class DaoCommon {

    findAll(sqlRequest, sqlParams={}) {
        return new Promise(function (resolve, reject) {
            let stmt = database.db.prepare(sqlRequest);
            stmt.all(sqlParams, function (err, rows) {
                if (err) {
                    console.log(err)
                    reject(
                        new DaoError(20, "Internal server error")
                    );
                } else if (rows === null || rows.length === 0) {
                    reject(
                        new DaoError(21, "Entity not found")
                    );
                } else {
                    resolve(rows);
                }
            })
        });
    }

    findOne(sqlRequest, sqlParams={}) {
        return new Promise(function (resolve, reject) {
            let stmt = database.db.prepare(sqlRequest);
            stmt.all(sqlParams, function (err, rows) {
                if (err) {
                    reject(
                        new DaoError(11, "Invalid arguments")
                    );
                } else if (rows === null || rows.length === 0) {
                    reject(
                        new DaoError(21, "Entity not found")
                    );
                } else {
                    let row = rows[0];
                    resolve(row);
                }
            })
        });
    }

    existsOne(sqlRequest, sqlParams) {
        return new Promise(function (resolve, reject) {
            let stmt = database.db.prepare(sqlRequest);
            stmt.each(sqlParams, function (err, row) {
                if (err) {
                    reject(
                        new DaoError(20, "Internal server error")
                    );
                } else if (row && row.found === 1) {
                    resolve(true);
                } else {
                    reject(
                        new DaoError(21, "Entity not found")
                    );
                }
            })
        });
    }

    run(sqlRequest, sqlParams) {
        return new Promise(function (resolve, reject) {
            let stmt = database.db.prepare(sqlRequest);
            stmt.run(sqlParams, function (err) {
                if (this.changes === 1) {
                    resolve(true);
                } else if (this.changes === 0) {
                    reject(
                        new DaoError(21, "Entity not found")
                    )
                } else {
                    console.log(err);
                    reject(
                        new DaoError(11, "Invalid arguments")
                    )
                }
            })
        });
    }
}

