import { Family } from './family';

export
class Place {
    public placeid: number;
    public label: string;

    public maplat: number;
    public maplng: number;
    public geolat: number;
    public geolng: number;

    public notes: string;

    public families: Family[];

    public constructor(placeid:number, label:string, maplat:number, maplng: number) {
        this.placeid = placeid;
        this.label = label;
        this.maplat = maplat;
        this.maplng = maplng;

        this.families = [];
    }
}
