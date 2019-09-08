import { FamilyDao } from '../dao/familyDao';
import { ControllerCommon } from './common/controllerCommon';
import { Family } from '../model/family';

export
class FamilyController {

    private familyDao: FamilyDao;
    private common: ControllerCommon;

    constructor() {
        this.familyDao = new FamilyDao();
        this.common = new ControllerCommon();
    }

    findById(req, res) {
        let mapId = req.params.mapid;
        let userId = req.params.userid;
        let familyId = req.params.familyid;

        let censusYear = req.query['census'] || 1870;

        this.familyDao.findById(mapId, userId, censusYear, familyId)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    findAll(req, res) {
        let mapId = req.params.mapid;
        let userId = req.params.userid;

        let limit = req.query['limit'];
        let offset = req.query['offset'];
        let censusYear = req.query['census'] || 1870;

        this.familyDao.findAll(mapId, userId, censusYear, limit, offset)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    countAll(req, res) {
        let mapId = req.params.mapid;
        let userid = req.params.userid;

        this.familyDao.countAll(mapId)
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    update(req, res) {
        let mapId = req.params.mapid;
        let userId = req.params.userid;
        let familyId = req.params.familyid;

        let censusYear = req.query['census'] || 1870;

        const family = new Family(familyId, censusYear);
        family.associated_placeid = req.body.associated_placeid;

        return this.familyDao.update(userId, family)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    exists(req, res) {
        let familyid = req.params.familyid;
        this.familyDao.exists(familyid)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}
