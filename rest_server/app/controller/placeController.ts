import { PlaceDao } from '../dao/placeDao';
import { ControllerCommon } from './common/controllerCommon';
import { Place } from '../model/place';

export
class PlaceController {

    private placeDao: PlaceDao;
    private common: ControllerCommon;

    constructor() {
        this.placeDao = new PlaceDao();
        this.common = new ControllerCommon();
    }

    findById(req, res) {

        console.log(req.params);

        let mapid = req.params.mapid;
        let userid = req.params.userid;
        let placeid = req.params.placeid;

        let censusYear = req.query['census'] || 1870;

        this.placeDao.findById(mapid,userid,censusYear,placeid)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    findAll(req, res) {
        let mapid = req.params.mapid;
        let userid = req.params.userid;

        let limit = req.query['limit'];
        let offset = req.query['offset'];
        let censusYear = req.query['census'] || 1870;

        console.log(`mapid = ${mapid}`);
        console.log(`userid = ${userid}`);
        console.log(`limit = ${limit}`);
        console.log(`offset = ${offset}`);
        console.log(`censusYear = ${censusYear}`);

        this.placeDao.findAll(mapid,userid,censusYear,limit,offset)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };

    countAll(req, res) {
        let mapid = req.params.mapid;
        let userid = req.params.userid;

        console.log(`mapid=${mapid}`);

        this.placeDao.countAll(mapid)
            .then(this.common.findSuccess(res))
            .catch(this.common.serverError(res));
    };

    update(req, res) {
        let mapid = req.params.mapid;
        let userId = req.params.userid;
        let placeid = req.params.placeid;

        const place = new Place(placeid, req.body.label, req.body.maplat, req.body.maplng);
        place.notes = req.body.notes;

        return this.placeDao.update(userId, place)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };


    exists(req, res) {
        let mapid = req.params.mapid;
        let userid = req.params.userid;
        let placeid = req.params.placeid;

        this.placeDao.exists(placeid)
            .then(this.common.existsSuccess(res))
            .catch(this.common.findError(res));
    };
}
