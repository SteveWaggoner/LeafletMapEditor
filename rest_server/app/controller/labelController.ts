import { LabelDao } from '../dao/labelDao';
import { ControllerCommon } from './common/controllerCommon';
import { Label } from '../model/label';

/**
 * Label Controller
 */
export
class LabelController {

  private labelDao: LabelDao;
  private common: ControllerCommon;

    constructor() {
        this.labelDao = new LabelDao();
        this.common = new ControllerCommon();
    }

    /**
     * Tries to find an entity using its Id / Primary Key
     * @params req, res
     * @return entity
     */
    findById(req, res) {
        let id = req.params.id;

        this.labelDao.findById(id)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Finds all entities.
     * @return all entities
     */
     findAll(req, res) {
        let limit = req.query['limit'];
        let offset = req.query['offset'];
        let text = req.query['text'];

        this.labelDao.findAll(limit,offset,text)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    /**
     * Counts all the records present in the database
     * @return count
     */
    countAll(res) {

        this.labelDao.countAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Updates the given entity in the database
     * @params req, res
     * @return true if the entity has been updated, false if not found and not updated
     */
    update(req, res) {
        const label = new Label();
        label.id = req.body.id;
        label.text = req.body.text;
        label.x = req.body.x;
        label.y = req.body.y;

        return this.labelDao.update(label)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Creates the given entity in the database
     * @params req, res
     * returns database insertion status
     */
    create(req, res) {
        let label = new Label();
        if (req.body.id) {
            label.id = req.body.id;
        }
        label.text = req.body.text;
        label.x = req.body.x;
        label.y = req.body.y;

        console.log(label);

        if (req.body.id) {
            return this.labelDao.createWithId(label)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }
        else {
            return this.labelDao.create(label)
                .then(this.common.editSuccess(res))
                .catch(this.common.serverError(res));
        }

    };

    /**
     * Deletes an entity using its Id / Primary Key
     * @params req, res
     * returns database deletion status
     */
    deleteById(req, res) {
        let id = req.params.id;

        this.labelDao.deleteById(id)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    /**
     * Returns true if an entity exists with the given Id / Primary Key
     * @params req, res
     * @return
     */
    exists(req, res) {
        let id = req.params.id;

        this.labelDao.exists(id)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}

