import { Label } from '../model/label';
import { DaoCommon } from './common/daoCommon';

/**
 * Label Data Access Object
 */
export 
class LabelDao {
    private common: DaoCommon;

    constructor() {
        this.common = new DaoCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
    findById(id) {
        let sqlRequest = "SELECT id, text, x, y FROM label WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.findOne(sqlRequest, sqlParams).then(row =>
            new Label(row.id, row.text, row.x, row.y));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
    findAll() {
        let sqlRequest = "SELECT * FROM label";
        return this.common.findAll(sqlRequest).then(rows => {
            let labels = [];
            for (const row of rows) {
                labels.push(new Label(row.id, row.text, row.x, row.y));
            }
            return labels;
        });
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll() {
        let sqlRequest = "SELECT COUNT(*) AS count FROM label";
        return this.common.findOne(sqlRequest);
    };

    /**
     * Updates the given entity in the database
     * @params Label
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(Label) {
        let sqlRequest = "UPDATE label SET " +
            "text=$text, " +
            "x=$x, " +
            "y=$y " +
            "WHERE id=$id";

        let sqlParams = {
            $text: Label.text,
            $x: Label.x,
            $y: Label.y,
            $id: Label.id
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity in the database
     * @params Label
     * returns database insertion status
     */
    create(Label) {
        let sqlRequest = "INSERT into label (text, x, y) " +
            "VALUES ($text, $x, $y)";
        let sqlParams = {
            $text: Label.text,
            $x: Label.x,
            $y: Label.y
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Creates the given entity with a provided id in the database
     * @params Label
     * returns database insertion status
     */
    createWithId(Label) {
        let sqlRequest = "INSERT into label (id, text, x, y) " +
            "VALUES ($id, $text, $x, $y)";
        let sqlParams = {
            $id: Label.id,
            $text: Label.text,
            $x: Label.x,
            $y: Label.y
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params id
     * returns database deletion status
     */
    deleteById(id) {
        let sqlRequest = "DELETE FROM label WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params id
     * returns database entry existence status (true/false)
     */
    exists(id) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM label WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };
}

