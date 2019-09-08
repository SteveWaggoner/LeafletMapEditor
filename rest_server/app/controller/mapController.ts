import { MapDao } from '../dao/mapDao';
import { ControllerCommon } from './common/controllerCommon';

export
class MapController {

    private mapDao: MapDao;
    private common: ControllerCommon;

    constructor() {
        this.mapDao = new MapDao();
        this.common = new ControllerCommon();
    }

    findById(req, res) {
        let mapid = req.params.mapid;

        this.mapDao.findById(mapid)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    findAll(req, res) {
        let limit = req.query['limit'];
        let offset = req.query['offset'];

        this.mapDao.findAll(limit,offset)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    countAll(res) {

        this.mapDao.countAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    exists(req, res) {
        let mapid = req.params.mapid;

        this.mapDao.exists(mapid)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}

