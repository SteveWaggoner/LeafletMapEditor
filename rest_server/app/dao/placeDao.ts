import { Place } from '../model/place';
import { DaoCommon } from './common/daoCommon';
import {Family} from "../model/family";
import {Person} from "../model/person";

export
class PlaceDao {
    private common: DaoCommon;

    constructor() {
        this.common = new DaoCommon();
    }

    placeQuery(mapId:number,userId:number, censusYear:number,placeLimit=100000,placeOffset=0): string {
        return `
        WITH
        -- gather user specific edits to places        
        sel_user_places AS
            (select b.email, a.*
            from user_places a
            inner join users b on a.userid=b.userid and b.userid=${userId}),
        -- gather user specific edits to persons
        sel_user_persons AS
           (select b.email, a.*
            from user_persons a
            inner join users b on a.userid=b.userid and b.userid=${userId}),
        -- gather user specific edits to census
        sel_user_family AS
            (select b.email, a.*
             from user_family a
             inner join users b on a.userid=b.userid and b.userid=${userId}),
        -- gather the most likely family to place link (the defaults)
        def_family AS
            (select familyid, placeid def_placeid, email
             from
                (
                select *,
                row_number() over(partition by familyid order by authority desc, userid) == 1 as is_default
                from
                    (
                    select familyid, placeid, sum(level) as authority, email, min(a.userid) userid
                    from user_family a
                    inner join users b on a.userid=b.userid and b.level > 1
                    group by familyid, placeid
                    ) x
                ) z
            where is_default),
        sel_user_census AS
            (select censusyear, coalesce(a.email,x.email) email, coalesce(a.placeid,x.def_placeid) placeid, c.familyid, c.districtid, c.personid,
                head,
                coalesce(d.correctedsurname,c.surname) surname,
                coalesce(d.correctedgivenname,c.givenname) givenname,
                age,
                birthyear,
                gender,
                race,
                occupation,
                realestate,
                personalestate,
                birthplace
            from census c
                left outer join sel_user_persons d on c.personid=d.personid
                left outer join def_family x on c.familyid=x.familyid
                left outer join sel_user_family a on a.familyid=c.familyid
            where c.censusyear=${censusYear}),
        page_places AS
            (
            select *
            from places
            where mapid = ${mapId}
            limit ${placeLimit} offset ${placeOffset}
            ),
        my_places AS
            (select email,
                a.placeid,
                coalesce(c.correctedlabel,a.label) label,
                b.mapid,
                b.mapname,
                b.censusyear,
                coalesce(c.correcteddistrictid,a.districtid) districtid,
                d.state,
                d.county,
                d.district,
                coalesce(c.correctedmaplat,a.maplat) maplat,
                coalesce(c.correctedmaplng,a.maplng) maplng,
                coalesce(c.geolat,c.correctedmaplat,a.maplat) geolat,
                coalesce(c.geolng,c.correctedmaplng,a.maplng) geolng,
                c.placenotes
            from page_places a
                inner join maps b on a.mapid=b.mapid 
                left outer join sel_user_places  c on a.placeid=c.placeid
                left outer join district d on coalesce(c.correcteddistrictid,a.districtid)=d.districtid)
        select a.*,
            a.censusyear,
            e.familyid,
            e.personid,
            coalesce(e.head,1) head,
            e.surname,
            e.givenname,
            e.age
        from my_places a
            left outer join sel_user_census e on a.placeid=e.placeid`
    }


    findPlaces(sqlRequest:string, sqlParams = {}) {

        console.log(sqlRequest);

        return this.common.findAll(sqlRequest, sqlParams).then(rows => {
            let places= [];
            var place = null;
            for (const row of rows) {

                console.log(`placeId=${row.placeid}, label=${row.label}, head=${row.head}`);

                if ( place == null || place.placeid != row.placeid) {

                    if (place!=null) {
                        places.push(place);
                    }
                    place = new Place(row.placeid, row.label, row.maplat, row.maplng)
                    place.geolat = row.geolat;
                    place.geolng = row.geolng;
                    place.notes = row.placenotes;

                    let family = new Family(row.familyid,row.censusyear);
                    place.families.push(family)
                }

                //add family member
                let lastfamily = place.families[place.families.length-1];
                let member = new Person(row.personid,row.givenname,row.surname,row.age)

                if ( lastfamily.familyid != row.familyid) {
                    let family = new Family(row.familyid, row.censusyear);
                    family.members.push(member);
                    place.families.push(family)
                } else {
                    lastfamily.members.push(member);
                }
            }
            if ( place != null ) {
                places.push(place);
            }
            return places;
        });
    };

    findById(mapId:number,userId:number, censusYear:number,placeId:number) {

        let sqlRequest = this.placeQuery(mapId, userId, censusYear) + ` WHERE mapid=${mapId} AND a.placeid=${placeId} ORDER BY a.placeid, personid`;
        return this.findPlaces(sqlRequest);
    };

    findAll(mapId:number, userId:number, censusYear:number, limit:number=10,offset:number=0) {

        let sqlRequest = this.placeQuery(mapId, userId, censusYear, limit, offset) + ` WHERE mapid=${mapId} ORDER BY placeid, personid`;
        return this.findPlaces(sqlRequest);
    };

    countAll(mapid:number) {
        let sqlRequest = "SELECT COUNT(*) AS count FROM places WHERE mapid=$mapid";
        let sqlParams = {$mapid: mapid};
        return this.common.findOne(sqlRequest,sqlParams);
    };

    update(userId:number, place: Place) {

        console.log(place);

        let sqlRequest =
        `
        INSERT INTO user_places (userid, placeid, correctedlabel, correctedmaplat, correctedmaplng, geolat, geolng, placenotes) 
            VALUES($userId, $placeId, $label, $maplat, $maplng, $geolat, $geolng, $notes)
        ON CONFLICT(userid, placeid) DO UPDATE 
            SET correctedlabel=excluded.correctedlabel,
                correctedmaplat=excluded.correctedmaplat,
                correctedmaplng=excluded.correctedmaplng,
                geolat=excluded.geolat,
                geolng=excluded.geolng,
                placenotes=excluded.placenotes
                ;
        `;

        let sqlParams = {
            $userId: userId,
            $placeId: place.placeid,
            $label: place.label,
            $maplat: place.maplat,
            $maplng: place.maplng,
            $geolat: place.geolat,
            $geolng: place.geolng,
            $notes: place.notes
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    exists(id) {
        let sqlRequest = "SELECT (count(*) > 0) as found FROM places WHERE placeid=$id";
        let sqlParams = {$id: id};
        return this.common.findOne(sqlRequest, sqlParams);
    };
}
