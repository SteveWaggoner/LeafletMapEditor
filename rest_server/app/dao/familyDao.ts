import { Family } from '../model/family';
import { DaoCommon } from './common/daoCommon';
import {Person} from "../model/person";
import {Place} from "../model/place";

export
class FamilyDao {
    private common: DaoCommon;

    constructor() {
        this.common = new DaoCommon();
    }

    familyQuery(mapId:number,userId:number, censusYear:number, familyLimit=100000, familyOffset=0): string {
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
        my_census AS
            (select c.censusyear, coalesce(a.email,x.email) email, coalesce(a.placeid,x.def_placeid) placeid, c.familyid, c.districtid, c.personid,
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
                birthplace,
                m.mapid
            from census c
                inner join maps m on m.mapid=${mapId} and c.districtid like m.area||'%' 
                left outer join sel_user_persons d on c.personid=d.personid
                left outer join def_family x on c.familyid=x.familyid
                left outer join sel_user_family a on a.familyid=c.familyid
            where c.censusyear=${censusYear} and c.head=1 ),
            
        my_places AS
            (select email,
                a.placeid,
                coalesce(c.correctedlabel,a.label) label,
                b.mapid,
                b.mapname,
                b.censusyear,
                a.districtid,
                d.state,
                d.county,
                d.district,
                coalesce(c.correctedmaplat,a.maplat) maplat,
                coalesce(c.correctedmaplng,a.maplng) maplng,
                coalesce(c.geolat,c.correctedmaplat,a.maplat) geolat,
                coalesce(c.geolng,c.correctedmaplng,a.maplng) geolng,
                c.placenotes
            from places a
                inner join maps b on a.mapid=b.mapid 
                left outer join sel_user_places  c on a.placeid=c.placeid
                left outer join district d on a.districtid=d.districtid),
                
        my_census2 as
            (select
                e.censusyear,
                e.districtid,
                row_number() over(order by personid) ord,
                count(*) over(partition by head) max_ord,
                e.surname,
                e.givenname,
                e.age,
                e.familyid,
                a.placeid,
                a.label,
                a.maplat,
                a.maplng,
                d.geolat dgeolat,
                d.geolng dgeolng,
                e.mapid
            from my_census e
                left outer join my_places a on a.placeid=e.placeid
                left outer join district d on e.districtid=d.districtid
            where head=1),                
                
        census_bracket as
            (select x.*,
                coalesce(lag(ord) over(order by censusyear, districtid, ord),-1000000000) prev_ord,
                coalesce(lag(maplat) over(order by censusyear, districtid, ord),dgeolat) prev_maplat,
                coalesce(lag(maplng) over(order by censusyear, districtid, ord),dgeolng) prev_maplng,
                coalesce(lead(ord) over(order by censusyear, districtid, ord),1000000000) next_ord,
                coalesce(lead(maplat) over(order by censusyear, districtid, ord),dgeolat) next_maplat,
                coalesce(lead(maplng) over(order by censusyear, districtid, ord),dgeolng) next_maplng
            from
                (
                select censusyear, a.districtid, ord, label, maplat, maplng, dgeolat, dgeolng
                from my_census2 a
                where maplat is not null
                ) x),                

        my_census3 as
            (select a.*,

                coalesce(r.ord,c.ord,0) start_ord,
                coalesce(l.ord,c.ord,max_ord+1) end_ord,
                round(1.0* (a.ord - coalesce(r.ord,c.ord,0) ) /
                    (coalesce(l.ord,c.ord,max_ord+1) - coalesce(r.ord,c.ord,0)),2) offset,

                coalesce(r.maplat,c.maplat,a.dgeolat) start_maplat,
                coalesce(l.maplat,c.maplat,a.dgeolat) end_maplat,

                coalesce(r.maplng,c.maplng,a.dgeolng) start_maplng,
                coalesce(l.maplng,c.maplng,a.dgeolng) end_maplng

            from my_census2 a
                left outer join census_bracket c on a.ord=c.ord
                left outer join census_bracket l on a.ord between l.prev_ord+1 and l.ord-1
                left outer join census_bracket r on a.ord between r.ord+1 and r.next_ord-1),
        my_census4 as                
            (select *,
                round(start_maplat + ((end_maplat - start_maplat) * coalesce(offset,0)),5) proj_maplat,
                round(start_maplng + ((end_maplng - start_maplng) * coalesce(offset,0)),5) proj_maplng
            from my_census3
            limit ${familyLimit} offset ${familyOffset}
            ),
        my_census5 as
            (select 
                a.placeid,
                a.familyid,
                b.*,
                coalesce(label,a.givenname||' '||a.surname) final_label, 
                coalesce(maplat,proj_maplat) final_maplat, coalesce(maplng,proj_maplng) final_maplng,
                a.mapid,
                a.dgeolat,
                a.dgeolng 
            from my_census4 a
                inner join census b on a.familyid=b.familyid
            order by personid)
        select * from my_census5`
    }


    findFamilies(sqlRequest:string, sqlParams = {}) {

        return this.common.findAll(sqlRequest, sqlParams).then(rows => {
            let families= [];
            var family = null;
            for (const row of rows) {

                if (family == null || family.familyid != row.familyid) {

                    if (family != null) {
                        families.push(family);
                    }
                    family = new Family(row.familyid, row.censusyear)
                    family.associated_mapid = row.mapid;
                    family.associated_placeid = row.placeid;
                    family.label = row.final_label;
                    family.maplat = row.final_maplat;
                    family.maplng = row.final_maplng;
                    family.geolat = row.dgeolat;
                    family.geolng = row.dgeolng;
                }

                //add family member
                let member = new Person(row.personid, row.givenname, row.surname, row.age)
                family.members.push(member);
            }
            if ( family != null ) {
                families.push(family);
            }
            return families;
        });
    };


    findById(mapId:number,userId:number, censusYear:number,familyId:number) {

        let sqlRequest = this.familyQuery(mapId, userId, censusYear) + ` WHERE familyid=${familyId}`;
        return this.findFamilies(sqlRequest);
    };

    findAll(mapId:number, userId:number, censusYear:number, limit:number, offset:number) {

        let sqlRequest = this.familyQuery(mapId, userId, censusYear, limit, offset);
        return this.findFamilies(sqlRequest);
    }

    countAll(mapId:number) {
        let sqlRequest = `SELECT COUNT(distinct familyid) AS count FROM census a inner join maps b on b.mapid=${mapId} and districtid like b.area||'%'`;
        return this.common.findOne(sqlRequest);
    };

    update(userId:number, family:Family) {

        if ( family.associated_placeid == null ) {
            return this.common.run(`DELETE FROM user_family WHERE userid=${userId} and familyid=${family.familyid}`,{})
        }

        let sqlRequest =
        `    
        INSERT INTO user_family (userid, familyid, placeid) 
            VALUES($userId, $familyId, $placeId)
        ON CONFLICT(userid, familyid) DO UPDATE 
            SET familyid=excluded.familyid
        `;

        let sqlParams = {
            $userId: userId,
            $familyId: family.familyid,
            $placeId: family.associated_placeid
        };
        return this.common.run(sqlRequest, sqlParams);
    };

    exists(familyid:number) {
        let sqlRequest = `SELECT count(*)>0 as found FROM census WHERE familyid=${familyid}`;
        return this.common.findOne(sqlRequest);
    };
}
