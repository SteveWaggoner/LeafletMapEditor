import { Map } from '../model/map';
import { DaoCommon } from './common/daoCommon';

export
class MapDao {
    private common: DaoCommon;

    constructor() {
        this.common = new DaoCommon();
    }

    findById(mapid:number) {
        let sqlRequest = "SELECT mapid, mapname, censusyear, area FROM maps WHERE mapid=$mapid";
        let sqlParams = {$mapid: mapid};
        return this.common.findOne(sqlRequest, sqlParams).then(row =>
            new Map(row.mapid, row.mapname, row.censusyear, row.area));
    };

    findAll(limit:number=100,offset:number=0) {
        let sqlRequest = "SELECT mapid, mapname, censusyear, area FROM maps ORDER BY mapid LIMIT $limit OFFSET $offset";
        let sqlParams = {$limit: limit, $offset: offset};
        return this.common.findAll(sqlRequest, sqlParams).then(rows => {
            let labels = [];
            for (const row of rows) {
                labels.push(new Map(row.mapid, row.mapname, row.censusyear, row.area));
            }
            return labels;
        });
    };

    countAll() {
        let sqlRequest = "SELECT COUNT(*) AS count FROM maps";
        return this.common.findOne(sqlRequest);
    };

    exists(mapid:number) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM maps WHERE mapid=$mapid";
        let sqlParams = {$mapid: mapid};
        return this.common.run(sqlRequest, sqlParams);
    };
}
