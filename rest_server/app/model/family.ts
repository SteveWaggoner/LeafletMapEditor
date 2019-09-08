import { Person } from './person';

export
class Family {
    public familyid: number;
    public censusyear: number;
    public members: Person[];

    //used to update object
    public associated_placeid: number;

    //calculated fields
    public label:  string;
    public maplat: number;
    public maplng: number;
    public geolat: number;
    public geolng: number;

    public constructor(familyid:number, censusyear:number) {
        this.familyid = familyid;
        this.censusyear = censusyear;
        this.members = []
    }
}

